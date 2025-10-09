-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('staff', 'tutor');

-- Create enum for user status
CREATE TYPE public.user_status AS ENUM ('active', 'inactive');

-- Create enum for pet species
CREATE TYPE public.pet_species AS ENUM ('dog', 'cat', 'bird', 'other');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  social_media TEXT,
  lgpd_consent BOOLEAN DEFAULT false,
  image_publication_consent BOOLEAN DEFAULT false,
  status user_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create pets table
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pet_name TEXT NOT NULL,
  species pet_species NOT NULL,
  breed TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on pets
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Create lucky_numbers table
CREATE TABLE public.lucky_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL UNIQUE,
  lucky_number TEXT NOT NULL UNIQUE,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on lucky_numbers
ALTER TABLE public.lucky_numbers ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, social_media, lgpd_consent, image_publication_consent)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'social_media', ''),
    COALESCE((NEW.raw_user_meta_data->>'lgpd_consent')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'image_publication_consent')::boolean, false)
  );
  
  -- Assign tutor role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'tutor');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Staff can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'staff'));

-- RLS Policies for pets
CREATE POLICY "Users can view their own pets"
  ON public.pets FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Staff can view all pets"
  ON public.pets FOR SELECT
  USING (public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Users can insert their own pets"
  ON public.pets FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own pets"
  ON public.pets FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own pets"
  ON public.pets FOR DELETE
  USING (auth.uid() = owner_id);

-- RLS Policies for lucky_numbers
CREATE POLICY "Users can view lucky numbers for their pets"
  ON public.lucky_numbers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pets
      WHERE pets.id = lucky_numbers.pet_id
        AND pets.owner_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view all lucky numbers"
  ON public.lucky_numbers FOR SELECT
  USING (public.has_role(auth.uid(), 'staff'));

CREATE POLICY "System can insert lucky numbers"
  ON public.lucky_numbers FOR INSERT
  WITH CHECK (true);

-- Create function to generate lucky number
CREATE OR REPLACE FUNCTION public.generate_lucky_number()
RETURNS TEXT
LANGUAGE plpgsql
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();