-- Corrigir RLS para permitir INSERT anônimo
-- Remover RLS temporariamente para limpar todas as políticas

ALTER TABLE public.tutores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Cadastro público tutores" ON public.tutores;
DROP POLICY IF EXISTS "Colaboradores leem tutores" ON public.tutores;
DROP POLICY IF EXISTS "Cadastro público pets" ON public.pets;
DROP POLICY IF EXISTS "Colaboradores leem pets" ON public.pets;
DROP POLICY IF EXISTS "Permitir cadastro público tutores" ON public.tutores;
DROP POLICY IF EXISTS "Colaboradores veem tutores" ON public.tutores;
DROP POLICY IF EXISTS "Permitir cadastro público pets" ON public.pets;
DROP POLICY IF EXISTS "Colaboradores veem pets" ON public.pets;

-- Reabilitar RLS
ALTER TABLE public.tutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Criar política de INSERT para usuários anônimos E autenticados
CREATE POLICY "Permitir INSERT público tutores"
  ON public.tutores
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Permitir INSERT público pets"
  ON public.pets
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Criar política de SELECT apenas para colaboradores autenticados
CREATE POLICY "Colaboradores podem ver tutores"
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

CREATE POLICY "Colaboradores podem ver pets"
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