-- Create book_user_contributions table for user-generated content
CREATE TABLE public.book_user_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_slug TEXT NOT NULL,
  cluster_id TEXT,
  author TEXT NOT NULL,
  submission TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submission_type TEXT NOT NULL DEFAULT 'general' CHECK (submission_type IN ('general', 'exemplar', 'case_study', 'framework', 'thinker')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.book_user_contributions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view approved contributions and their own" 
ON public.book_user_contributions 
FOR SELECT 
USING (status = 'approved' OR user_id = auth.uid());

CREATE POLICY "Authenticated users can create contributions" 
ON public.book_user_contributions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update their own pending contributions" 
ON public.book_user_contributions 
FOR UPDATE 
USING (user_id = auth.uid() AND status = 'pending');

-- Create index for better performance
CREATE INDEX idx_book_user_contributions_book_slug ON public.book_user_contributions(book_slug);
CREATE INDEX idx_book_user_contributions_status ON public.book_user_contributions(status);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_book_user_contributions_updated_at
BEFORE UPDATE ON public.book_user_contributions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_timestamp();