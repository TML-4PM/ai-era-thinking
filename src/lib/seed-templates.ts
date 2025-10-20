import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_TEMPLATES } from "./book-template-defaults";

/**
 * Seeds the book_templates table with default templates
 * This should be run once by an admin user to populate the templates
 */
export async function seedBookTemplates() {
  try {
    console.log('Seeding book templates...');

    // Check if templates already exist
    const { data: existingTemplates } = await supabase
      .from('book_templates')
      .select('id');

    if (existingTemplates && existingTemplates.length > 0) {
      console.log('Templates already exist. Skipping seed.');
      return { success: true, message: 'Templates already seeded' };
    }

    // Insert all default templates
    const { data, error } = await supabase
      .from('book_templates')
      .insert(DEFAULT_TEMPLATES.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description,
        icon: template.icon,
        template_config: template.template_config as any,
        tab_config: template.tab_config as any,
        default_chapters: template.default_chapters as any,
        collection: template.collection,
        suggested_series: template.suggested_series,
        features: template.features,
        best_for: template.best_for,
        example_books: template.example_books,
        is_active: template.is_active,
        is_featured: template.is_featured,
        usage_count: template.usage_count,
      })))
      .select();

    if (error) {
      console.error('Error seeding templates:', error);
      throw error;
    }

    console.log(`Successfully seeded ${data.length} templates`);
    return { success: true, message: `Seeded ${data.length} templates`, data };
  } catch (error) {
    console.error('Failed to seed templates:', error);
    return { success: false, error };
  }
}

// Helper function to update a specific template
export async function updateTemplate(templateId: string, updates: Partial<any>) {
  try {
    const { data, error } = await supabase
      .from('book_templates')
      .update(updates)
      .eq('id', templateId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Failed to update template:', error);
    return { success: false, error };
  }
}

// Helper function to delete all templates (for re-seeding)
export async function clearAllTemplates() {
  try {
    const { error } = await supabase
      .from('book_templates')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) throw error;
    console.log('Cleared all templates');
    return { success: true };
  } catch (error) {
    console.error('Failed to clear templates:', error);
    return { success: false, error };
  }
}
