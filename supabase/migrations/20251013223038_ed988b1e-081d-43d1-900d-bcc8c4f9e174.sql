-- Fix 1: Add protection to lucky number generation to prevent duplicates and validate inputs
CREATE OR REPLACE FUNCTION public.gerar_numero_sorte(pet_uuid UUID, evento_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  novo_num INTEGER;
BEGIN
  -- Validate that evento exists
  IF NOT EXISTS (SELECT 1 FROM public.eventos WHERE id = evento_uuid) THEN
    RAISE EXCEPTION 'Invalid event ID';
  END IF;
  
  -- Validate that pet exists
  IF NOT EXISTS (SELECT 1 FROM public.pets_tutor WHERE id = pet_uuid) THEN
    RAISE EXCEPTION 'Invalid pet ID';
  END IF;
  
  -- Check if this pet already has a lucky number for this event
  IF EXISTS (
    SELECT 1 FROM public.lucky_numbers_tutor 
    WHERE pet_id = pet_uuid AND event_id = evento_uuid
  ) THEN
    RAISE EXCEPTION 'Lucky number already generated for this pet in this event';
  END IF;

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

-- Fix 2: Add staff authentication to search function
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
  -- Require authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Verify user is an active staff member
  IF NOT EXISTS (
    SELECT 1 FROM public.colaboradores 
    WHERE auth_uid = auth.uid() AND status = true
  ) THEN
    RAISE EXCEPTION 'Staff access required';
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