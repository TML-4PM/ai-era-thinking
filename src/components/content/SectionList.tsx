import { Section } from '@/types/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Users, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContentLoader } from './ContentLoader';
import { useState, useEffect } from 'react';

interface SectionListProps {
  sections: Section[];
  bookSlug: string;
}

export function SectionList({ sections, bookSlug }: SectionListProps) {
  const navigate = useNavigate();
  const [sectionCounts, setSectionCounts] = useState<Record<string, number>>({});

  // Load actual exemplar counts for seeded sections
  useEffect(() => {
    const loadCounts = async () => {
      const counts: Record<string, number> = {};
      
      for (const section of sections) {
        if (section.status === 'seeded' && section.contentFile) {
          try {
            const response = await fetch(`/books/content/${section.contentFile}`);
            if (response.ok) {
              const data = await response.json();
              const exemplarCount = data.clusters?.reduce((total: number, cluster: any) => 
                total + (cluster.exemplars?.length || 0), 0) || 0;
              counts[section.id] = exemplarCount;
            }
          } catch (error) {
            console.error(`Failed to load count for ${section.id}:`, error);
          }
        }
      }
      
      setSectionCounts(counts);
    };

    loadCounts();
  }, [sections]);

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
              {section.lead_description}
            </p>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>
                {section.status === 'seeded' && sectionCounts[section.id] 
                  ? `${sectionCounts[section.id]} exemplars`
                  : section.exemplarCount 
                    ? `${section.exemplarCount} exemplars`
                    : 'Content framework ready'
                }
              </span>
            </div>
            
            {section.status === 'seeded' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/books/${bookSlug}/sections/${section.id}`)}
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Open Chapter
              </Button>
            )}
            
            {section.status === 'scaffold' && (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate(`/books/${bookSlug}/sections/${section.id}`)}
                className="w-full"
              >
                <Clock className="w-4 h-4 mr-2" />
                Start Seeding
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}