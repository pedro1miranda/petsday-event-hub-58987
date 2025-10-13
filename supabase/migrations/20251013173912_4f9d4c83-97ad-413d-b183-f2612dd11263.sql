-- ================================
-- NORMALIZAÇÃO DO BANCO DE DADOS
-- Remove duplicatas e estabelece estrutura correta
-- ================================

-- Remover tabelas duplicadas se existirem
DROP TABLE IF EXISTS public.pets_novo CASCADE;
DROP TABLE IF EXISTS public.lucky_numbers_novo CASCADE;

-- ================================
-- 1. COLABORADORES
-- ================================
CREATE TABLE IF NOT EXISTS public.colaboradores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_uid UUID UNIQUE,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha_hash TEXT,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.colaboradores ENABLE ROW LEVEL SECURITY;

-- Policy: Colaboradores podem ver próprios dados
DROP POLICY IF EXISTS "Colaboradores podem ver próprios dados" ON public.colaboradores;
CREATE POLICY "Colaboradores podem ver próprios dados" 
ON public.colaboradores 
FOR SELECT 
USING (auth.uid() = auth_uid);

-- ================================
-- 2. TUTORES
-- ================================
CREATE TABLE IF NOT EXISTS public.tutores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT,
    redes_sociais TEXT,
    lgpd_consent BOOLEAN DEFAULT FALSE,
    image_publication_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tutores ENABLE ROW LEVEL SECURITY;

-- Policy: Permitir cadastro público de tutores
DROP POLICY IF EXISTS "Permitir cadastro público de tutores" ON public.tutores;
CREATE POLICY "Permitir cadastro público de tutores" 
ON public.tutores 
FOR INSERT 
WITH CHECK (true);

-- Policy: Colaboradores podem ver tutores
DROP POLICY IF EXISTS "Colaboradores podem ver tutores" ON public.tutores;
CREATE POLICY "Colaboradores podem ver tutores" 
ON public.tutores 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.colaboradores c 
    WHERE c.auth_uid = auth.uid() AND c.status = true
));

-- ================================
-- 3. EVENTOS
-- ================================
CREATE TABLE IF NOT EXISTS public.eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_evento TEXT NOT NULL,
    data_evento TIMESTAMP WITH TIME ZONE,
    local_evento TEXT,
    whatsapp_link TEXT,
    descricao TEXT,
    lucky_number_counter INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

-- Policy: Eventos públicos
DROP POLICY IF EXISTS "Eventos públicos" ON public.eventos;
CREATE POLICY "Eventos públicos" 
ON public.eventos 
FOR SELECT 
USING (true);

-- ================================
-- 4. PETS
-- ================================
CREATE TABLE IF NOT EXISTS public.pets_tutor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID NOT NULL REFERENCES public.tutores(id) ON DELETE CASCADE,
    pet_name TEXT NOT NULL,
    especie TEXT,
    breed TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.pets_tutor ENABLE ROW LEVEL SECURITY;

-- Policy: Permitir cadastro público de pets
DROP POLICY IF EXISTS "Permitir cadastro público de pets" ON public.pets_tutor;
CREATE POLICY "Permitir cadastro público de pets" 
ON public.pets_tutor 
FOR INSERT 
WITH CHECK (true);

-- Policy: Colaboradores podem ver pets
DROP POLICY IF EXISTS "Colaboradores podem ver pets" ON public.pets_tutor;
CREATE POLICY "Colaboradores podem ver pets" 
ON public.pets_tutor 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.colaboradores c 
    WHERE c.auth_uid = auth.uid() AND c.status = true
));

-- ================================
-- 5. LUCKY NUMBERS
-- ================================
CREATE TABLE IF NOT EXISTS public.lucky_numbers_tutor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES public.pets_tutor(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
    lucky_number INTEGER NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, lucky_number)
);

ALTER TABLE public.lucky_numbers_tutor ENABLE ROW LEVEL SECURITY;

-- Policy: Sistema pode inserir números
DROP POLICY IF EXISTS "Sistema pode inserir números" ON public.lucky_numbers_tutor;
CREATE POLICY "Sistema pode inserir números" 
ON public.lucky_numbers_tutor 
FOR INSERT 
WITH CHECK (true);

-- Policy: Colaboradores podem ver números
DROP POLICY IF EXISTS "Colaboradores podem ver números" ON public.lucky_numbers_tutor;
CREATE POLICY "Colaboradores podem ver números" 
ON public.lucky_numbers_tutor 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.colaboradores c 
    WHERE c.auth_uid = auth.uid() AND c.status = true
));

-- ================================
-- 6. FUNÇÃO: GERAR NÚMERO DA SORTE
-- ================================
CREATE OR REPLACE FUNCTION public.gerar_numero_sorte(pet_uuid UUID, evento_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  novo_num INTEGER;
BEGIN
  -- Bloqueia o evento e incrementa o contador
  UPDATE public.eventos
  SET lucky_number_counter = lucky_number_counter + 1
  WHERE id = evento_uuid
  RETURNING lucky_number_counter INTO novo_num;

  -- Insere o número da sorte
  INSERT INTO public.lucky_numbers_tutor(pet_id, event_id, lucky_number)
  VALUES (pet_uuid, evento_uuid, novo_num);

  RETURN novo_num;
END;
$$;

-- ================================
-- 7. FUNÇÃO: BUSCAR USUÁRIOS
-- ================================
CREATE OR REPLACE FUNCTION public.buscar_usuarios(search_term TEXT DEFAULT '')
RETURNS TABLE (
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

-- ================================
-- 8. SEED: EVENTO PADRÃO
-- ================================
INSERT INTO public.eventos (nome_evento, whatsapp_link, descricao)
SELECT
  'PETs Day - Dog no Park',
  'https://chat.whatsapp.com/seu-link-aqui',
  'Evento especial para tutores e seus pets!'
WHERE NOT EXISTS (
  SELECT 1 FROM public.eventos WHERE nome_evento = 'PETs Day - Dog no Park'
);