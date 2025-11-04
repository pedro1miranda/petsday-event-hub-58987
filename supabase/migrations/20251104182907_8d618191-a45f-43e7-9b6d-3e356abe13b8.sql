-- Fix RLS policies to allow public registration while restricting SELECT to authenticated colaboradores

-- 1) Ensure RLS is enabled
ALTER TABLE IF EXISTS public.tutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.eventos ENABLE ROW LEVEL SECURITY;

-- 2) Tutores: Allow public INSERT for registration
DROP POLICY IF EXISTS "Cadastro público tutores" ON public.tutores;
DROP POLICY IF EXISTS "Permitir cadastro público de tutores" ON public.tutores;
CREATE POLICY "Cadastro público tutores"
  ON public.tutores
  FOR INSERT
  TO public, anon, authenticated
  WITH CHECK (true);

-- 3) Tutores: SELECT only for authenticated colaboradores
DROP POLICY IF EXISTS "Colaboradores veem tutores" ON public.tutores;
DROP POLICY IF EXISTS "Colaboradores podem ver tutores" ON public.tutores;
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

-- 4) Pets: Allow public INSERT for registration
DROP POLICY IF EXISTS "Cadastro público pets" ON public.pets;
DROP POLICY IF EXISTS "Permitir cadastro público de pets" ON public.pets;
CREATE POLICY "Cadastro público pets"
  ON public.pets
  FOR INSERT
  TO public, anon, authenticated
  WITH CHECK (true);

-- 5) Pets: SELECT only for authenticated colaboradores
DROP POLICY IF EXISTS "Colaboradores veem pets" ON public.pets;
DROP POLICY IF EXISTS "Colaboradores podem ver pets" ON public.pets;
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

-- 6) Eventos: Allow public SELECT
DROP POLICY IF EXISTS "Eventos públicos" ON public.eventos;
CREATE POLICY "Eventos públicos"
  ON public.eventos
  FOR SELECT
  TO public, anon, authenticated
  USING (true);