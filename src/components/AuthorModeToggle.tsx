import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, BookOpen } from 'lucide-react';
import { useAuthorMode } from '@/hooks/useAuthorMode';

export function AuthorModeToggle() {
  const { isAuthorMode, toggleAuthorMode } = useAuthorMode();

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isAuthorMode ? (
              <Edit className="w-5 h-5 text-primary" />
            ) : (
              <BookOpen className="w-5 h-5 text-muted-foreground" />
            )}
            <div>
              <Label htmlFor="author-mode" className="text-sm font-medium">
                {isAuthorMode ? 'Author Mode' : 'Reader Mode'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {isAuthorMode 
                  ? 'View writing progress and chapter management' 
                  : 'Standard book reading experience'
                }
              </p>
            </div>
          </div>
          <Switch
            id="author-mode"
            checked={isAuthorMode}
            onCheckedChange={toggleAuthorMode}
          />
        </div>
      </CardContent>
    </Card>
  );
}