-- Corrigir RLS para permitir cadastro público de tutores e pets

-- 1) Remover políticas antigas de INSERT
DROP POLICY IF EXISTS "Cadastro público tutores" ON public.tutores;
DROP POLICY IF EXISTS "Cadastro público pets" ON public.pets;

-- 2) Criar nova política para INSERT público em tutores (permite anon e authenticated)
CREATE POLICY "Permitir cadastro público tutores"
  ON public.tutores
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 3) Criar nova política para INSERT público em pets (permite anon e authenticated)
CREATE POLICY "Permitir cadastro público pets"
  ON public.pets
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 4) Garantir que as políticas SELECT existentes permanecem (apenas colaboradores veem)
DROP POLICY IF EXISTS "Colaboradores veem tutores" ON public.tutores;
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

DROP POLICY IF EXISTS "Colaboradores veem pets" ON public.pets;
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