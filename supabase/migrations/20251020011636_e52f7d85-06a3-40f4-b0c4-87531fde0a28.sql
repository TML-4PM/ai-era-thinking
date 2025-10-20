-- Add user ownership columns to books table
ALTER TABLE books 
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS collaborators UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS template_id UUID;

-- Create book_templates table
CREATE TABLE IF NOT EXISTS book_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  template_config JSONB NOT NULL,
  tab_config JSONB NOT NULL,
  default_chapters JSONB,
  collection TEXT,
  suggested_series TEXT,
  features TEXT[],
  best_for TEXT[],
  example_books TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on books and book_templates
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for books table
CREATE POLICY "Users can create their own books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can view public or own books"
  ON books FOR SELECT
  USING (
    is_public = true 
    OR created_by = auth.uid() 
    OR auth.uid() = ANY(collaborators)
    OR has_role('admin')
  );

CREATE POLICY "Users can update their own books"
  ON books FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR auth.uid() = ANY(collaborators) OR has_role('admin'));

CREATE POLICY "Users can delete their own books"
  ON books FOR DELETE
  TO authenticated
  USING (created_by = auth.uid() OR has_role('admin'));

-- RLS policies for book_templates table
CREATE POLICY "Anyone can view active templates"
  ON book_templates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage templates"
  ON book_templates FOR ALL
  TO authenticated
  USING (has_role('admin'))
  WITH CHECK (has_role('admin'));

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_book_templates_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_book_templates_updated_at
  BEFORE UPDATE ON book_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_book_templates_timestamp();