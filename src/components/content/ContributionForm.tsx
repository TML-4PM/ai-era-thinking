import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Volume {
  id: string;
  title: string;
  slug?: string;
}

interface ContributionFormProps {
  bookSlug: string;
  clusterId?: string;
  exemplarKey?: string;
  volumes?: Volume[];
  isQuickInsight?: boolean;
}

interface ContributionFormData {
  author: string;
  submission: string;
  tags: string;
  submission_type: 'general' | 'exemplar' | 'case_study' | 'framework' | 'thinker';
  exemplar_key?: string;
  progress?: number;
  notes?: string;
}

const VOLUME_KEYWORDS = {
  'A1': ['ethics', 'consent', 'privacy', 'bias', 'fairness', 'safety', 'responsible'],
  'A2': ['policy', 'regulation', 'governance', 'compliance', 'audit', 'legal'],
  'A3': ['education', 'learning', 'curriculum', 'pedagogy', 'knowledge', 'teaching'],
  'A4': ['health', 'clinical', 'patient', 'wellbeing', 'care', 'medical', 'healthcare'],
  'A5': ['climate', 'emissions', 'sustainability', 'environment', 'energy', 'carbon']
};

export function ContributionForm({ bookSlug, clusterId, exemplarKey, volumes = [], isQuickInsight = false }: ContributionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState<string>('');
  const [showVolumeSelector, setShowVolumeSelector] = useState(false);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ContributionFormData>({
    defaultValues: {
      submission_type: 'general'
    }
  });

  const submissionType = watch('submission_type');
  const watchedText = watch('submission', '');
  const watchedTags = watch('tags', '');

  // Auto-route based on keywords for Quick Insight mode
  const autoRouteVolume = (text: string, tags: string) => {
    if (!isQuickInsight || !volumes.length) return '';
    
    const content = `${text} ${tags}`.toLowerCase();
    let bestMatch = { volumeId: '', score: 0 };
    
    Object.entries(VOLUME_KEYWORDS).forEach(([volumeId, keywords]) => {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (content.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > bestMatch.score) {
        bestMatch = { volumeId, score };
      }
    });
    
    return bestMatch.score > 0 ? bestMatch.volumeId : volumes[0]?.id || '';
  };

  const routedVolume = autoRouteVolume(watchedText, watchedTags);
  const finalVolumeId = selectedVolume || routedVolume;
  const selectedVolumeData = volumes.find(v => v.id === finalVolumeId);

  const onSubmit = async (data: ContributionFormData) => {
    try {
      setIsSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to submit contributions");
        return;
      }

      const contribution = {
        author: data.author,
        submission: data.submission,
        tags: data.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
        submission_type: isQuickInsight ? 'general' : data.submission_type,
        book_slug: bookSlug,
        cluster_id: isQuickInsight ? finalVolumeId : clusterId,
        exemplar_key: exemplarKey,
        progress: data.submission_type === 'exemplar' ? data.progress : undefined,
        notes: data.submission_type === 'exemplar' ? data.notes : undefined,
        user_id: user.id
      };

      const { error } = await supabase
        .from('book_user_contributions')
        .insert([contribution]);

      if (error) throw error;

      toast.success("Insight submitted successfully!");
      reset();
      setSelectedVolume('');
      setShowVolumeSelector(false);
    } catch (error) {
      console.error('Error submitting contribution:', error);
      toast.error("Failed to submit insight. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isQuickInsight) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Insight</CardTitle>
          <p className="text-sm text-muted-foreground">
            Share insights that connect to the book's themes
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="submission">Your Insight</Label>
              <Textarea
                id="submission"
                placeholder="Share your thoughts, examples, or connections to the book's themes..."
                className="min-h-[100px]"
                {...register("submission", { required: "Please provide your insight" })}
              />
              {errors.submission && (
                <p className="text-sm text-destructive">{errors.submission.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Your Name</Label>
                <Input
                  id="author"
                  type="text"
                  placeholder="Your name"
                  {...register("author", { required: "Name is required" })}
                />
                {errors.author && (
                  <p className="text-sm text-destructive">{errors.author.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (optional)</Label>
                <Input
                  id="tags"
                  type="text"
                  placeholder="ethics, policy, education..."
                  {...register("tags")}
                />
              </div>
            </div>

            {/* Auto-routing indicator */}
            {selectedVolumeData && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Routed to:</span>
                  <span className="font-medium">{selectedVolumeData.title}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVolumeSelector(!showVolumeSelector)}
                >
                  Change
                </Button>
              </div>
            )}

            {/* Volume selector dropdown */}
            {showVolumeSelector && (
              <div className="space-y-2">
                <Label>Select Chapter</Label>
                <select
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  value={selectedVolume}
                  onChange={(e) => setSelectedVolume(e.target.value)}
                >
                  {volumes.map((volume) => (
                    <option key={volume.id} value={volume.id}>
                      {volume.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Insight"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribute Your Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author">Your Name</Label>
              <Input
                id="author"
                type="text"
                placeholder="Your name"
                {...register("author", { required: "Name is required" })}
              />
              {errors.author && (
                <p className="text-sm text-destructive">{errors.author.message}</p>
              )}
            </div>

            {/* Submission Type */}
            <div className="space-y-2">
              <Label htmlFor="submission_type">Contribution Type</Label>
              <select
                id="submission_type"
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
                {...register("submission_type", { required: "Please select a type" })}
              >
                <option value="general">General Insight</option>
                <option value="exemplar">Exemplar Update</option>
                <option value="case_study">Case Study</option>
                <option value="framework">Framework</option>
                <option value="thinker">Thinker</option>
              </select>
              {errors.submission_type && (
                <p className="text-sm text-destructive">{errors.submission_type.message}</p>
              )}
            </div>
          </div>

          {/* Main Submission */}
          <div className="space-y-2">
            <Label htmlFor="submission">Your Contribution</Label>
            <Textarea
              id="submission"
              placeholder="Share your insights, examples, or suggestions..."
              className="min-h-[120px]"
              {...register("submission", { required: "Please provide your contribution" })}
            />
            {errors.submission && (
              <p className="text-sm text-destructive">{errors.submission.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              type="text"
              placeholder="AI, ethics, healthcare, etc."
              {...register("tags")}
            />
          </div>

          {/* Conditional fields for exemplar type */}
          {submissionType === 'exemplar' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0-100"
                  {...register("progress", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  type="text"
                  placeholder="Additional notes"
                  {...register("notes")}
                />
              </div>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Contribution"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}