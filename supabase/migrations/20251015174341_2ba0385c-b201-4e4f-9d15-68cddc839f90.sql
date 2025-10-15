-- =====================================================
-- Migration: Backend Corrections & Normalization
-- Objetivo: Normalizar schema, criar função transacional segura, RLS adequadas
-- =====================================================

-- 1. GARANTIR TABELAS BASE (idempotente)
-- =====================================================

-- Tabela colaboradores (já existe, garantir estrutura)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'colaboradores' AND column_name = 'senha_hash') THEN
    ALTER TABLE public.colaboradores ADD COLUMN senha_hash TEXT;
  END IF;
END $$;

-- Tabela eventos (garantir counter)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'eventos' AND column_name = 'lucky_number_counter') THEN
    ALTER TABLE public.eventos ADD COLUMN lucky_number_counter INTEGER DEFAULT 0;
  END IF;
END $$;

-- 2. CRIAR FUNÇÃO TRANSACIONAL DE GERAÇÃO DE LUCKY NUMBER (SECURITY DEFINER)
-- =====================================================

CREATE OR REPLACE FUNCTION public.gerar_numero_sorte(pet_uuid UUID, evento_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  novo_num INTEGER;
BEGIN
  -- Validar evento
  IF NOT EXISTS (SELECT 1 FROM public.eventos WHERE id = evento_uuid) THEN
    RAISE EXCEPTION 'Evento inválido';
  END IF;
  
  -- Validar pet
  IF NOT EXISTS (SELECT 1 FROM public.pets_tutor WHERE id = pet_uuid) THEN
    RAISE EXCEPTION 'Pet inválido';
  END IF;
  
  -- Verificar duplicata
  IF EXISTS (
    SELECT 1 FROM public.lucky_numbers_tutor 
    WHERE pet_id = pet_uuid AND event_id = evento_uuid
  ) THEN
    RAISE EXCEPTION 'Número da sorte já foi gerado para este pet neste evento';
  END IF;

  -- TRANSAÇÃO ATÔMICA: bloquear evento, incrementar counter, inserir número
  UPDATE public.eventos
  SET lucky_number_counter = lucky_number_counter + 1
  WHERE id = evento_uuid
  RETURNING lucky_number_counter INTO novo_num;

  -- Inserir número da sorte
  INSERT INTO public.lucky_numbers_tutor(pet_id, event_id, lucky_number)
  VALUES (pet_uuid, evento_uuid, novo_num);

  RETURN novo_num;
END;
$$;

-- 3. CRIAR RPC BUSCAR_USUARIOS (atualizada e segura)
-- =====================================================

CREATE OR REPLACE FUNCTION public.buscar_usuarios(search_term TEXT DEFAULT '')
RETURNS TABLE(
  tutor_id UUID,
  tutor_nome TEXT,
  pet_id UUID,
  pet_nome TEXT,
  especie TEXT,
  breed TEXT,
  numero_sorte INTEGER,
  telefone TEXT,
  email TEXT,
  redes_sociais TEXT,
  lgpd_consent BOOLEAN,
  image_publication_consent BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Exigir autenticação
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Autenticação necessária';
  END IF;
  
  -- Verificar se é colaborador ativo
  IF NOT EXISTS (
    SELECT 1 FROM public.colaboradores 
    WHERE auth_uid = auth.uid() AND status = true
  ) THEN
    RAISE EXCEPTION 'Acesso restrito a colaboradores';
  END IF;

  RETURN QUERY
  SELECT
    t.id AS tutor_id,
    t.full_name AS tutor_nome,
    p.id AS pet_id,
    p.pet_name AS pet_nome,
    p.especie,
    p.breed,
    l.lucky_number AS numero_sorte,
    t.telefone,
    t.email,
    t.redes_sociais,
    t.lgpd_consent,
    t.image_publication_consent
  FROM public.tutores t
  JOIN public.pets_tutor p ON p.tutor_id = t.id
  LEFT JOIN public.lucky_numbers_tutor l ON l.pet_id = p.id
  WHERE
    search_term = '' OR
    t.full_name ILIKE '%' || search_term || '%' OR
    p.pet_name ILIKE '%' || search_term || '%' OR
    (l.lucky_number IS NOT NULL AND CAST(l.lucky_number AS TEXT) ILIKE '%' || search_term || '%');
END;
$$;

-- 4. ATUALIZAR POLICIES RLS (sem dependências de funções inexistentes)
-- =====================================================

-- Tutores: INSERT público (cadastro), SELECT restrito a colaboradores
DROP POLICY IF EXISTS "Permitir cadastro público de tutores" ON public.tutores;
DROP POLICY IF EXISTS "Colaboradores podem ver tutores" ON public.tutores;

CREATE POLICY "Cadastro público de tutores"
ON public.tutores
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Colaboradores visualizam tutores"
ON public.tutores
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.colaboradores c
    WHERE c.auth_uid = auth.uid() AND c.status = true
  )
);

-- Pets: INSERT público, SELECT restrito a colaboradores
DROP POLICY IF EXISTS "Permitir cadastro público de pets" ON public.pets_tutor;
DROP POLICY IF EXISTS "Colaboradores podem ver pets" ON public.pets_tutor;

CREATE POLICY "Cadastro público de pets"
ON public.pets_tutor
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Colaboradores visualizam pets"
ON public.pets_tutor
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.colaboradores c
    WHERE c.auth_uid = auth.uid() AND c.status = true
  )
);

-- Lucky Numbers: INSERT pela função (SECURITY DEFINER), SELECT por colaboradores
DROP POLICY IF EXISTS "Sistema pode inserir números" ON public.lucky_numbers_tutor;
DROP POLICY IF EXISTS "Colaboradores podem ver números" ON public.lucky_numbers_tutor;

CREATE POLICY "Sistema insere números da sorte"
ON public.lucky_numbers_tutor
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Colaboradores visualizam números"
ON public.lucky_numbers_tutor
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.colaboradores c
    WHERE c.auth_uid = auth.uid() AND c.status = true
  )
);

-- Colaboradores: SELECT próprio registro
DROP POLICY IF EXISTS "Colaboradores podem ver próprios dados" ON public.colaboradores;

CREATE POLICY "Colaboradores veem próprios dados"
ON public.colaboradores
FOR SELECT
USING (auth.uid() = auth_uid);

-- 5. CRIAR EVENTO PADRÃO (se não existir)
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.eventos LIMIT 1) THEN
    INSERT INTO public.eventos (
      nome_evento,
      data_evento,
      local_evento,
      descricao,
      whatsapp_link,
      lucky_number_counter
    ) VALUES (
      'PETs Day 2025',
      NOW() + INTERVAL '30 days',
      'Parque Dog no Park',
      'Evento anual de celebração dos pets',
      'https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20mais%20informações%20sobre%20o%20PETs%20Day',
      0
    );
  END IF;
END $$;

-- 6. COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON FUNCTION public.gerar_numero_sorte IS 'Gera número da sorte único de forma transacional e segura';
COMMENT ON FUNCTION public.buscar_usuarios IS 'Busca tutores e pets por termo (restrito a colaboradores autenticados)';