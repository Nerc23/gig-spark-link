
-- First, ensure we have a clean slate and properly create the user_type enum
DROP TYPE IF EXISTS user_type CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the user_type enum
CREATE TYPE user_type AS ENUM ('freelancer', 'client');

-- Ensure the profiles table uses the correct enum type
ALTER TABLE public.profiles ALTER COLUMN user_type TYPE user_type USING user_type::text::user_type;

-- Recreate the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_type_value user_type;
BEGIN
    -- Get the user type from metadata, default to 'freelancer'
    user_type_value := COALESCE(NEW.raw_user_meta_data->>'user_type', 'freelancer')::user_type;
    
    -- Insert into profiles table
    INSERT INTO public.profiles (id, user_type, email, full_name)
    VALUES (
        NEW.id,
        user_type_value,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User')
    );
    
    -- Create user-specific profile based on type
    IF user_type_value = 'freelancer' THEN
        INSERT INTO public.freelancer_profiles (id) VALUES (NEW.id);
    ELSE
        INSERT INTO public.client_profiles (id) VALUES (NEW.id);
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't block user creation
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
