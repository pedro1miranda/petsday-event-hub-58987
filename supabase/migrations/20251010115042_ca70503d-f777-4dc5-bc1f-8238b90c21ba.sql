-- ================================
-- MIGRATION SQL - PETs Day / Dog no Park
-- Banco relacional completo e idempotente
-- ================================

-- EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================
-- 1. COLABORADORES (FUNCIONÁRIOS)
-- ================================
CREATE TABLE IF NOT EXISTS public.colaboradores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_uid UUID UNIQUE, -- vínculo com o Supabase Auth
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha_hash TEXT,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- ================================
-- 4. PETS (atualizar estrutura existente)
-- ================================
CREATE TABLE IF NOT EXISTS public.pets_novo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID NOT NULL REFERENCES public.tutores(id) ON DELETE CASCADE,
    pet_name TEXT NOT NULL,
    especie TEXT,
    breed TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- 5. LUCKY NUMBERS (atualizar estrutura)
-- ================================
CREATE TABLE IF NOT EXISTS public.lucky_numbers_novo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES public.pets_novo(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
    lucky_number INTEGER NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, lucky_number)
);

-- ================================
-- 6. FUNÇÃO: GERAR NÚMERO DA SORTE POR EVENTO
-- ================================
CREATE OR REPLACE FUNCTION public.gerar_numero_sorte(pet_uuid UUID, evento_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  novo_num INTEGER;
BEGIN
  UPDATE public.eventos
  SET lucky_number_counter = lucky_number_counter + 1
  WHERE id = evento_uuid
  RETURNING lucky_number_counter INTO novo_num;

  INSERT INTO public.lucky_numbers_novo(pet_id, event_id, lucky_number)
  VALUES (pet_uuid, evento_uuid, novo_num);

  RETURN novo_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================
-- 7. RPC DE BUSCA
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
) AS $$
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
  JOIN public.pets_novo p ON p.tutor_id = t.id
  LEFT JOIN public.lucky_numbers_novo l ON l.pet_id = p.id
  WHERE
    search_term = '' OR
    t.full_name ILIKE '%' || search_term || '%' OR
    p.pet_name ILIKE '%' || search_term || '%' OR
    (l.lucky_number IS NOT NULL AND CAST(l.lucky_number AS TEXT) ILIKE '%' || search_term || '%');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================
-- 8. RLS POLICIES
-- ================================
ALTER TABLE public.colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets_novo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lucky_numbers_novo ENABLE ROW LEVEL SECURITY;

-- Colaboradores: apenas eles mesmos podem ver seus dados
CREATE POLICY "Colaboradores podem ver próprios dados" ON public.colaboradores
  FOR SELECT USING (auth.uid() = auth_uid);

-- Tutores: colaboradores autenticados podem ver todos
CREATE POLICY "Colaboradores podem ver tutores" ON public.tutores
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.colaboradores c WHERE c.auth_uid = auth.uid() AND c.status = true)
  );

-- Tutores: permitir inserção pública (cadastro)
CREATE POLICY "Permitir cadastro público de tutores" ON public.tutores
  FOR INSERT WITH CHECK (true);

-- Pets: colaboradores podem ver todos
CREATE POLICY "Colaboradores podem ver pets" ON public.pets_novo
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.colaboradores c WHERE c.auth_uid = auth.uid() AND c.status = true)
  );

-- Pets: permitir inserção pública (cadastro)
CREATE POLICY "Permitir cadastro público de pets" ON public.pets_novo
  FOR INSERT WITH CHECK (true);

-- Lucky numbers: colaboradores podem ver
CREATE POLICY "Colaboradores podem ver números" ON public.lucky_numbers_novo
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.colaboradores c WHERE c.auth_uid = auth.uid() AND c.status = true)
  );

-- Lucky numbers: permitir inserção via função
CREATE POLICY "Sistema pode inserir números" ON public.lucky_numbers_novo
  FOR INSERT WITH CHECK (true);

-- Eventos: todos podem ler
CREATE POLICY "Eventos públicos" ON public.eventos
  FOR SELECT USING (true);

-- ================================
-- 9. SEED - Dados iniciais
-- ================================

-- Inserir evento padrão se não existir
INSERT INTO public.eventos (nome_evento, whatsapp_link, descricao, data_evento)
SELECT
  'PETs Day - Dog no Park',
  'https://chat.whatsapp.com/seu-link-aqui',
  'Evento especial para tutores e seus pets!',
  NOW() + INTERVAL '30 days'
WHERE NOT EXISTS (
  SELECT 1 FROM public.eventos WHERE nome_evento = 'PETs Day - Dog no Park'
);

-- Criar usuário colaborador no Auth (será feito manualmente via signup)
-- Depois, vincular ao colaboradores com INSERT abaixo

-- Seed do colaborador será feito após criar o usuário no Auth
-- Por enquanto, apenas garantir que a estrutura está pronta