import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Master4500ExemplarCard } from '@/components/content/Master4500ExemplarCard';
import { getAllExemplars, searchExemplars } from '@/services/ThinkingEngineService';
import { Search, Filter, Grid3x3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';

const CHAPTERS = [
  'principles', 'institutions', 'doctrines', 'frameworks', 'thinkers',
  'disciplines', 'technologies', 'organizations', 'cultures', 'roles',
  'products', 'eras', 'environment', 'energy-and-forces', 'unstructured'
];

export function Master4500Browser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: exemplars, isLoading } = useQuery({
    queryKey: ['thinking-engine-exemplars', selectedSection, debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch) {
        return searchExemplars(debouncedSearch);
      }
      return getAllExemplars();
    },
  });

  // Filter exemplars by section and status
  const filteredExemplars = exemplars?.filter(exemplar => {
    if (selectedSection !== 'all' && exemplar.section_slug !== selectedSection) {
      return false;
    }
    if (statusFilter !== 'all' && exemplar.status !== statusFilter) {
      return false;
    }
    return true;
  }) || [];

  const stats = {
    total: filteredExemplars.length,
    complete: filteredExemplars.filter(e => e.status === 'complete').length,
    seeded: filteredExemplars.filter(e => e.status === 'seeded').length,
    scaffold: filteredExemplars.filter(e => e.status === 'scaffold').length,
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Master 4500 Browser</CardTitle>
          <p className="text-sm text-muted-foreground">
            Explore all {stats.total} exemplars across The Thinking Engine
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{stats.complete} Complete</Badge>
              <Badge variant="outline">{stats.seeded} Seeded</Badge>
              <Badge variant="outline">{stats.scaffold} Scaffold</Badge>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search exemplars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger>
                <SelectValue placeholder="All Chapters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chapters</SelectItem>
                {CHAPTERS.map(chapter => (
                  <SelectItem key={chapter} value={chapter}>
                    {chapter.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="seeded">Seeded</SelectItem>
                <SelectItem value="scaffold">Scaffold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exemplars Grid/List */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredExemplars.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No exemplars found matching your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
          {filteredExemplars.map(exemplar => (
            <Master4500ExemplarCard
              key={exemplar.id}
              exemplar={exemplar as any}
              bookSlug="thinking-engine"
            />
          ))}
        </div>
      )}
    </div>
  );
}