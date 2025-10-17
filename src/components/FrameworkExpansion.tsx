import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useMaster4500Section } from '@/hooks/useMaster4500';

interface FrameworkExpansionProps {
  sectionSlug: string;
}

export function FrameworkExpansion({ sectionSlug }: FrameworkExpansionProps) {
  const [isExpanding, setIsExpanding] = useState(false);
  const [expandedCount, setExpandedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentFramework, setCurrentFramework] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  
  const { toast } = useToast();
  const { data: frameworks, refetch } = useMaster4500Section(sectionSlug);

  const scaffoldFrameworks = frameworks?.filter(f => f.status === 'scaffold') || [];
  const completedFrameworks = frameworks?.filter(f => f.status === 'seeded' || f.status === 'complete') || [];

  const handleExpandFrameworks = async () => {
    if (scaffoldFrameworks.length === 0) {
      toast({
        title: 'No frameworks to expand',
        description: 'All frameworks are already expanded',
      });
      return;
    }

    setIsExpanding(true);
    setExpandedCount(0);
    setTotalCount(scaffoldFrameworks.length);
    setErrors([]);

    for (const framework of scaffoldFrameworks) {
      setCurrentFramework(framework.title);
      
      try {
        const { data, error } = await supabase.functions.invoke('expand-framework', {
          body: { frameworkId: framework.id }
        });

        if (error) {
          console.error(`Failed to expand ${framework.title}:`, error);
          setErrors(prev => [...prev, `${framework.title}: ${error.message}`]);
        } else {
          console.log(`Successfully expanded: ${framework.title}`);
          setExpandedCount(prev => prev + 1);
        }

        // Small delay between expansions to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (err) {
        console.error(`Error expanding ${framework.title}:`, err);
        setErrors(prev => [...prev, `${framework.title}: ${err instanceof Error ? err.message : 'Unknown error'}`]);
      }
    }

    // Refetch to show updated frameworks
    await refetch();
    
    setIsExpanding(false);
    setCurrentFramework('');

    toast({
      title: 'Framework expansion complete',
      description: `Successfully expanded ${expandedCount} of ${scaffoldFrameworks.length} frameworks`,
      variant: errors.length > 0 ? 'destructive' : 'default',
    });
  };

  const progress = totalCount > 0 ? (expandedCount / totalCount) * 100 : 0;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Framework Expansion
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1">
              <CheckCircle className="w-3 h-3" />
              {completedFrameworks.length} Expanded
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <AlertCircle className="w-3 h-3" />
              {scaffoldFrameworks.length} Remaining
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Use AI to generate comprehensive expansions for all {scaffoldFrameworks.length} scaffold frameworks,
            including era evolution, implementation phases, and related connections.
          </p>
          
          {frameworks && frameworks.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">{completedFrameworks.length} / {frameworks.length}</span>
              </div>
              <Progress value={(completedFrameworks.length / frameworks.length) * 100} />
            </div>
          )}
        </div>

        {isExpanding && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Expanding: <span className="font-medium">{currentFramework}</span></span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{expandedCount} / {totalCount}</span>
              </div>
              <Progress value={progress} />
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="space-y-2 p-4 bg-destructive/10 rounded-lg">
            <p className="text-sm font-medium text-destructive">Errors during expansion:</p>
            <ul className="text-xs space-y-1 text-destructive/80">
              {errors.slice(0, 5).map((error, i) => (
                <li key={i} className="font-mono">{error}</li>
              ))}
              {errors.length > 5 && (
                <li className="italic">...and {errors.length - 5} more errors</li>
              )}
            </ul>
          </div>
        )}

        <Button
          onClick={handleExpandFrameworks}
          disabled={isExpanding || scaffoldFrameworks.length === 0}
          className="w-full"
        >
          {isExpanding ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Expanding Frameworks...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Expand {scaffoldFrameworks.length} Frameworks with AI
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          This will use OpenAI API to generate detailed content for each framework. 
          Process may take several minutes depending on the number of frameworks.
        </p>
      </CardContent>
    </Card>
  );
}