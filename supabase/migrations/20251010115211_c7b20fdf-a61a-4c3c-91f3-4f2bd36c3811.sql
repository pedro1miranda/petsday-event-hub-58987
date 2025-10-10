-- Corrigir avisos de segurança: adicionar search_path às funções

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;