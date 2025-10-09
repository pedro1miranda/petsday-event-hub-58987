-- Fix security warnings by setting search_path on functions

-- Update generate_lucky_number function
CREATE OR REPLACE FUNCTION public.generate_lucky_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  number_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 6-digit number
    new_number := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Check if it exists
    SELECT EXISTS(SELECT 1 FROM public.lucky_numbers WHERE lucky_number = new_number) INTO number_exists;
    
    EXIT WHEN NOT number_exists;
  END LOOP;
  
  RETURN new_number;
END;
$$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;