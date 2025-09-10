import { Section } from '@/types/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Users, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SectionListProps {
  sections: Section[];
  bookSlug: string;
}

export function SectionList({ sections, bookSlug }: SectionListProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'seeded': return 'bg-green-500 text-white';
      case 'scaffold': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'seeded': return <CheckCircle className="w-4 h-4" />;
      case 'scaffold': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {sections.map((section) => (
        <Card key={section.id} className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <Badge className={`${getStatusColor(section.status)} flex items-center gap-1`}>
                {getStatusIcon(section.status)}
                {section.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {section.lead}
            </p>
            
            {section.exemplarCount && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{section.exemplarCount} exemplars</span>
              </div>
            )}
            
            {section.status === 'seeded' && section.slug && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/books/${section.slug}`)}
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Explore Content
              </Button>
            )}
            
            {section.status === 'scaffold' && (
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">
                  Content framework ready - awaiting development
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}