-- Phase 2: Add RLS policies for admin write access to books tables

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

-- Add write policies for books table (admin only for now)
CREATE POLICY "Admin can insert books" ON public.books
FOR INSERT TO authenticated
WITH CHECK (public.has_role('admin'));

CREATE POLICY "Admin can update books" ON public.books
FOR UPDATE TO authenticated
USING (public.has_role('admin'));

CREATE POLICY "Admin can delete books" ON public.books
FOR DELETE TO authenticated
USING (public.has_role('admin'));

-- Add write policies for book_chapters table (admin only for now)
CREATE POLICY "Admin can insert chapters" ON public.book_chapters
FOR INSERT TO authenticated
WITH CHECK (public.has_role('admin'));

CREATE POLICY "Admin can update chapters" ON public.book_chapters
FOR UPDATE TO authenticated
USING (public.has_role('admin'));

CREATE POLICY "Admin can delete chapters" ON public.book_chapters
FOR DELETE TO authenticated
USING (public.has_role('admin'));