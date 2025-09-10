import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ContributionFormProps {
  bookSlug: string;
  clusterId?: string;
}

interface ContributionFormData {
  author: string;
  submission: string;
  tags: string;
  submission_type: 'general' | 'exemplar' | 'case_study' | 'framework' | 'thinker';
}

export function ContributionForm({ bookSlug, clusterId }: ContributionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, watch } = useForm<ContributionFormData>({
    defaultValues: {
      submission_type: 'general'
    }
  });

  const submissionType = watch('submission_type');

  const onSubmit = async (data: ContributionFormData) => {
    try {
      setIsSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to submit a contribution.",
          variant: "destructive"
        });
        return;
      }

      const tags = data.tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const { error } = await supabase
        .from('book_user_contributions')
        .insert({
          user_id: user.id,
          book_slug: bookSlug,
          cluster_id: clusterId,
          author: data.author,
          submission: data.submission,
          tags,
          submission_type: data.submission_type
        });

      if (error) throw error;

      toast({
        title: "Contribution submitted!",
        description: "Thank you for your contribution. It will be reviewed and published if approved."
      });

      reset();
    } catch (error) {
      console.error('Error submitting contribution:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your contribution. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribute Your Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="author">Your Name</Label>
            <Input
              id="author"
              {...register('author', { required: true })}
              placeholder="How should we credit you?"
            />
          </div>

          <div>
            <Label htmlFor="submission_type">Contribution Type</Label>
            <Select
              value={submissionType}
              onValueChange={(value) => setValue('submission_type', value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Insight</SelectItem>
                <SelectItem value="exemplar">New Exemplar</SelectItem>
                <SelectItem value="case_study">Case Study</SelectItem>
                <SelectItem value="framework">Framework</SelectItem>
                <SelectItem value="thinker">Thinker Profile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="submission">Your Contribution</Label>
            <Textarea
              id="submission"
              {...register('submission', { required: true })}
              placeholder="Share your insights, examples, or additional information..."
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              {...register('tags')}
              placeholder="AI, management, decision-making, strategy..."
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Contribution
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}