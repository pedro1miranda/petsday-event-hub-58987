-- Reabilitar RLS e criar políticas corretas
-- Permitir que qualquer pessoa (incluindo anônimos) possa inserir tutores e pets
-- Mas apenas colaboradores autenticados podem visualizar

-- Reabilitar RLS
ALTER TABLE public.tutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Remover todas as políticas antigas
DROP POLICY IF EXISTS "Permitir cadastro público tutores" ON public.tutores;
DROP POLICY IF EXISTS "Colaboradores veem tutores" ON public.tutores;
DROP POLICY IF EXISTS "Permitir cadastro público pets" ON public.pets;
DROP POLICY IF EXISTS "Colaboradores veem pets" ON public.pets;

-- Criar política para permitir INSERT para TODOS (sem autenticação)
CREATE POLICY "Cadastro público tutores"
  ON public.tutores
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Cadastro público pets"
  ON public.pets
  FOR INSERT
  WITH CHECK (true);

-- Criar política para permitir SELECT apenas para colaboradores autenticados
CREATE POLICY "Colaboradores leem tutores"
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

CREATE POLICY "Colaboradores leem pets"
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