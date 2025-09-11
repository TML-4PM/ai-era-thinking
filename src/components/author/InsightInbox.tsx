import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Archive, CheckCircle, Move } from 'lucide-react';

interface UserContribution {
  id: string;
  author: string;
  submission: string;
  tags: string[];
  cluster_id: string;
  created_at: string;
  submission_type: string;
}

interface Volume {
  id: string;
  title: string;
}

interface InsightInboxProps {
  bookSlug: string;
  volumes: Volume[];
}

export function InsightInbox({ bookSlug, volumes }: InsightInboxProps) {
  const [contributions, setContributions] = useState<UserContribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContributions();
  }, [bookSlug]);

  const loadContributions = async () => {
    try {
      const { data, error } = await supabase
        .from('book_user_contributions')
        .select('*')
        .eq('book_slug', bookSlug)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setContributions(data || []);
    } catch (error) {
      console.error('Error loading contributions:', error);
      toast.error('Failed to load contributions');
    } finally {
      setLoading(false);
    }
  };

  const reassignContribution = async (contributionId: string, newVolumeId: string) => {
    try {
      const { error } = await supabase
        .from('book_user_contributions')
        .update({ cluster_id: newVolumeId })
        .eq('id', contributionId);

      if (error) throw error;
      
      setContributions(prev => 
        prev.map(c => c.id === contributionId ? { ...c, cluster_id: newVolumeId } : c)
      );
      
      toast.success('Contribution reassigned');
    } catch (error) {
      console.error('Error reassigning contribution:', error);
      toast.error('Failed to reassign contribution');
    }
  };

  const archiveContribution = async (contributionId: string) => {
    try {
      const { error } = await supabase
        .from('book_user_contributions')
        .delete()
        .eq('id', contributionId);

      if (error) throw error;
      
      setContributions(prev => prev.filter(c => c.id !== contributionId));
      toast.success('Contribution archived');
    } catch (error) {
      console.error('Error archiving contribution:', error);
      toast.error('Failed to archive contribution');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Insight Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Insight Inbox</CardTitle>
        <p className="text-sm text-muted-foreground">
          Recent insights for quick triage
        </p>
      </CardHeader>
      <CardContent>
        {contributions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent contributions
          </p>
        ) : (
          <div className="space-y-4">
            {contributions.map((contribution) => {
              const assignedVolume = volumes.find(v => v.id === contribution.cluster_id);
              
              return (
                <div key={contribution.id} className="p-3 border rounded-md space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{contribution.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(contribution.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {contribution.submission}
                    </p>
                    {contribution.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {contribution.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Routed to:</span>
                      <Badge variant="secondary" className="text-xs">
                        {assignedVolume?.title || contribution.cluster_id}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Select
                        value={contribution.cluster_id}
                        onValueChange={(value) => reassignContribution(contribution.id, value)}
                      >
                        <SelectTrigger className="h-7 w-7 p-0">
                          <Move className="h-3 w-3" />
                        </SelectTrigger>
                        <SelectContent>
                          {volumes.map((volume) => (
                            <SelectItem key={volume.id} value={volume.id}>
                              {volume.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => archiveContribution(contribution.id)}
                      >
                        <Archive className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}