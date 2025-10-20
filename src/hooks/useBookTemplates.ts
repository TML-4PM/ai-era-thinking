import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookTemplate } from "@/types/book-templates";

export const useBookTemplates = () => {
  return useQuery({
    queryKey: ['book-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('book_templates')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('name');
      
      if (error) throw error;
      return data as unknown as BookTemplate[];
    },
  });
};

export const useCreateBookFromTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      template, 
      bookData, 
      chapters 
    }: { 
      template: BookTemplate; 
      bookData: any; 
      chapters: any[] 
    }) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to create a book');

      // Create the book
      const { data: book, error: bookError } = await supabase
        .from('books')
        .insert({
          ...bookData,
          created_by: user.id,
          template_id: template.id,
        })
        .select()
        .single();
      
      if (bookError) throw bookError;

      // Create chapters
      if (chapters.length > 0) {
        const chaptersToInsert = chapters.map((chapter, index) => ({
          book_id: book.id,
          title: chapter.title,
          sections: chapter.sections,
          chapter_order: index + 1,
          progress: 0,
        }));

        const { error: chaptersError } = await supabase
          .from('book_chapters')
          .insert(chaptersToInsert);
        
        if (chaptersError) throw chaptersError;
      }

      // Update template usage count (optional, non-critical)
      try {
        await supabase
          .from('book_templates')
          .update({ usage_count: (template.usage_count || 0) + 1 })
          .eq('id', template.id);
      } catch (error) {
        // Ignore errors, usage count is not critical
        console.log('Failed to update template usage count:', error);
      }

      return book;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['user-books'] });
    },
  });
};
