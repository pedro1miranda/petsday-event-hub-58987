-- Correção definitiva de RLS para permitir cadastro público
-- Remove todas as políticas antigas e recria corretamente

-- Desabilitar RLS temporariamente
ALTER TABLE public.tutores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos DISABLE ROW LEVEL SECURITY;

-- Remover TODAS as políticas antigas de tutores
DROP POLICY IF EXISTS "Permitir cadastro público de tutores" ON public.tutores;
DROP POLICY IF EXISTS "Cadastro público tutores" ON public.tutores;
DROP POLICY IF EXISTS "Colaboradores veem tutores" ON public.tutores;
DROP POLICY IF EXISTS "Colaboradores podem ver tutores" ON public.tutores;
DROP POLICY IF EXISTS "Permitir INSERT público tutores" ON public.tutores;
DROP POLICY IF EXISTS "Colaboradores leem tutores" ON public.tutores;
DROP POLICY IF EXISTS "Permitir cadastro público tutores" ON public.tutores;

-- Remover TODAS as políticas antigas de pets
DROP POLICY IF EXISTS "Permitir cadastro público de pets" ON public.pets;
DROP POLICY IF EXISTS "Cadastro público pets" ON public.pets;
DROP POLICY IF EXISTS "Colaboradores veem pets" ON public.pets;
DROP POLICY IF EXISTS "Colaboradores podem ver pets" ON public.pets;
DROP POLICY IF EXISTS "Permitir INSERT público pets" ON public.pets;
DROP POLICY IF EXISTS "Colaboradores leem pets" ON public.pets;
DROP POLICY IF EXISTS "Permitir cadastro público pets" ON public.pets;

-- Remover políticas antigas de eventos
DROP POLICY IF EXISTS "Eventos públicos" ON public.eventos;

-- Reabilitar RLS
ALTER TABLE public.tutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

-- Forçar RLS mesmo para owner
ALTER TABLE public.tutores FORCE ROW LEVEL SECURITY;
ALTER TABLE public.pets FORCE ROW LEVEL SECURITY;

-- ✅ POLÍTICAS DEFINITIVAS PARA TUTORES

-- Cadastro público de tutores (sem login) - permite anon, public e authenticated
CREATE POLICY "Cadastro público tutores"
  ON public.tutores
  FOR INSERT
  TO anon, public, authenticated
  WITH CHECK (true);

-- Visualização restrita a colaboradores autenticados
CREATE POLICY "Colaboradores veem tutores"
  ON public.tutores
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.colaboradores c
      WHERE c.email = (current_setting('request.jwt.claims', true)::json->>'email')
        AND c.status = true
    )
  );

-- ✅ POLÍTICAS DEFINITIVAS PARA PETS

-- Cadastro público de pets (sem login)
CREATE POLICY "Cadastro público pets"
  ON public.pets
  FOR INSERT
  TO anon, public, authenticated
  WITH CHECK (true);

-- Visualização restrita de pets
CREATE POLICY "Colaboradores veem pets"
  ON public.pets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.colaboradores c
      WHERE c.email = (current_setting('request.jwt.claims', true)::json->>'email')
        AND c.status = true
    )
  );

-- ✅ POLÍTICAS PARA EVENTOS (leitura pública)

CREATE POLICY "Eventos públicos"
  ON public.eventos
  FOR SELECT
  TO anon, public, authenticated
  USING (true);