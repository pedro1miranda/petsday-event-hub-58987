-- =====================================================
-- Migration: Normalização Completa Pets Day (Versão 3)
-- Objetivo: Alinhar banco ao escopo - correção final
-- =====================================================

-- 1. DROPAR funções antigas
-- =====================================================

DROP FUNCTION IF EXISTS public.buscar_usuarios(text);
DROP FUNCTION IF EXISTS public.gerar_numero_sorte(uuid, uuid);

-- 2. DROPAR policies antigas
-- =====================================================

DROP POLICY IF EXISTS "Colaboradores visualizam tutores" ON public.tutores;
DROP POLICY IF EXISTS "Colaboradores veem próprios dados" ON public.colaboradores;
DROP POLICY IF EXISTS "Cadastro público de tutores" ON public.tutores;
DROP POLICY IF EXISTS "Cadastro público de pets" ON public.pets_tutor;
DROP POLICY IF EXISTS "Colaboradores visualizam pets" ON public.pets_tutor;

-- 3. DROPAR tabelas duplicadas
-- =====================================================

DROP TABLE IF EXISTS public.lucky_numbers CASCADE;
DROP TABLE IF EXISTS public.lucky_numbers_tutor CASCADE;
DROP TABLE IF EXISTS public.pets CASCADE;
DROP TABLE IF EXISTS public.pets_tutor CASCADE;

-- 4. ATUALIZAR COLABORADORES
-- =====================================================

ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 5. ATUALIZAR TUTORES
-- =====================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tutores' AND column_name = 'full_name') THEN
    ALTER TABLE public.tutores RENAME COLUMN full_name TO nome;
  END IF;
END $$;

ALTER TABLE public.tutores ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.tutores DROP COLUMN IF EXISTS redes_sociais;
ALTER TABLE public.tutores DROP COLUMN IF EXISTS lgpd_consent;
ALTER TABLE public.tutores DROP COLUMN IF EXISTS image_publication_consent;

-- 6. CRIAR TABELA PETS
-- =====================================================

CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_pet TEXT NOT NULL,
  especie TEXT NOT NULL,
  raca TEXT,
  idade INTEGER,
  id_tutor UUID NOT NULL REFERENCES public.tutores(id) ON DELETE CASCADE,
  numero_sorte INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_pets_id_tutor ON public.pets(id_tutor);
CREATE INDEX idx_pets_numero_sorte ON public.pets(numero_sorte);
CREATE UNIQUE INDEX idx_pets_numero_sorte_unique ON public.pets(numero_sorte) WHERE numero_sorte > 0;

-- 7. FUNÇÃO GERAR NÚMERO DA SORTE
-- =====================================================

CREATE FUNCTION public.gerar_numero_sorte_simples()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  novo_num INTEGER;
  max_tentativas INTEGER := 1000;
  tentativa INTEGER := 0;
BEGIN
  LOOP
    novo_num := floor(random() * 99999 + 1)::INTEGER;
    IF NOT EXISTS (SELECT 1 FROM public.pets WHERE numero_sorte = novo_num) THEN
      RETURN novo_num;
    END IF;
    tentativa := tentativa + 1;
    IF tentativa >= max_tentativas THEN
      RAISE EXCEPTION 'Não foi possível gerar número único';
    END IF;
  END LOOP;
END;
$$;

-- 8. TRIGGER AUTO-GERAR NÚMERO
-- =====================================================

CREATE FUNCTION public.trigger_gerar_numero_sorte()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.numero_sorte IS NULL OR NEW.numero_sorte = 0 THEN
    NEW.numero_sorte := public.gerar_numero_sorte_simples();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_auto_numero_sorte
  BEFORE INSERT ON public.pets
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_gerar_numero_sorte();

-- 9. POLICIES RLS
-- =====================================================

CREATE POLICY "Colaboradores se veem"
ON public.colaboradores FOR SELECT USING (true);

CREATE POLICY "Cadastro público tutores"
ON public.tutores FOR INSERT WITH CHECK (true);

CREATE POLICY "Colaboradores veem tutores"
ON public.tutores FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.colaboradores c
    WHERE c.email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

CREATE POLICY "Cadastro público pets"
ON public.pets FOR INSERT WITH CHECK (true);

CREATE POLICY "Colaboradores veem pets"
ON public.pets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.colaboradores c
    WHERE c.email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

-- 10. FUNÇÃO BUSCAR USUARIOS
-- =====================================================

CREATE FUNCTION public.buscar_usuarios(search_term TEXT DEFAULT '')
RETURNS TABLE(
  tutor_id UUID,
  tutor_nome TEXT,
  pet_id UUID,
  pet_nome TEXT,
  especie TEXT,
  raca TEXT,
  idade INTEGER,
  numero_sorte INTEGER,
  telefone TEXT,
  email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
BEGIN
  user_email := current_setting('request.jwt.claims', true)::json->>'email';
  
  IF user_email IS NULL THEN
    RAISE EXCEPTION 'Autenticação necessária';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.colaboradores WHERE email = user_email) THEN
    RAISE EXCEPTION 'Acesso restrito';
  END IF;

  RETURN QUERY
  SELECT
    t.id, t.nome, p.id, p.nome_pet, p.especie, p.raca, p.idade, p.numero_sorte, t.telefone, t.email
  FROM public.tutores t
  JOIN public.pets p ON p.id_tutor = t.id
  WHERE
    search_term = '' OR
    t.nome ILIKE '%' || search_term || '%' OR
    p.nome_pet ILIKE '%' || search_term || '%' OR
    CAST(p.numero_sorte AS TEXT) ILIKE '%' || search_term || '%'
  ORDER BY p.created_at DESC;
END;
$$;