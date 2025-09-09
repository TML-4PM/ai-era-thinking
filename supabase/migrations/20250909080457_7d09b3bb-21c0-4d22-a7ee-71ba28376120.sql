-- Phase 2: Add RLS policies for admin write access to books tables

-- Add 'moderator' to existing app_role enum if not already there
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'moderator' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')
    ) THEN
        ALTER TYPE public.app_role ADD VALUE 'moderator';
    END IF;
END $$;

-- Create user_roles table if not exists
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (only if it doesn't exist)
CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = _role
  );
END;
$$;

-- Add write policies for books table
CREATE POLICY "Admin can insert books" ON public.books
FOR INSERT TO authenticated
WITH CHECK (public.has_role('admin') OR public.has_role('moderator'));

CREATE POLICY "Admin can update books" ON public.books
FOR UPDATE TO authenticated
USING (public.has_role('admin') OR public.has_role('moderator'));

CREATE POLICY "Admin can delete books" ON public.books
FOR DELETE TO authenticated
USING (public.has_role('admin') OR public.has_role('moderator'));

-- Add write policies for book_chapters table
CREATE POLICY "Admin can insert chapters" ON public.book_chapters
FOR INSERT TO authenticated
WITH CHECK (public.has_role('admin') OR public.has_role('moderator'));

CREATE POLICY "Admin can update chapters" ON public.book_chapters
FOR UPDATE TO authenticated
USING (public.has_role('admin') OR public.has_role('moderator'));

CREATE POLICY "Admin can delete chapters" ON public.book_chapters
FOR DELETE TO authenticated
USING (public.has_role('admin') OR public.has_role('moderator'));