-- Desabilitar RLS completamente para tutores e pets
-- já que o cadastro é público e apenas colaboradores precisam ver os dados

ALTER TABLE public.tutores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets DISABLE ROW LEVEL SECURITY;