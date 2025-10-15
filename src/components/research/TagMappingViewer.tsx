import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Tag } from "lucide-react";
import { TAG_MAPPING } from "@/services/ResearchSyncService";

export const TagMappingViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMappings = Object.entries(TAG_MAPPING).filter(([key, values]) => {
    const search = searchTerm.toLowerCase();
    return (
      key.toLowerCase().includes(search) ||
      values.some(v => v.toLowerCase().includes(search))
    );
  });

  const getCategoryColor = (key: string): string => {
    if (key.includes('ai-') || key.includes('machine') || key.includes('quantum') || key.includes('agentic')) {
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20';
    }
    if (key.includes('behavioral') || key.includes('cognitive') || key.includes('neuro')) {
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20';
    }
    if (key.includes('systems') || key.includes('network') || key.includes('game')) {
      return 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20';
    }
    if (key.includes('leadership') || key.includes('innovation') || key.includes('organizational')) {
      return 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20';
    }
    if (key.includes('philosophy') || key.includes('logic') || key.includes('epistemology')) {
      return 'bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20';
    }
    return 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Tag Mapping System
        </CardTitle>
        <CardDescription>
          Intelligent tag mapping for auto-discovery. Each key expands to multiple related research tags.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Tag Mappings */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredMappings.map(([key, values]) => (
            <div key={key} className="space-y-2 p-3 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(key)}>
                  {key}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  → {values.length} tags
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {values.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredMappings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No tags found matching "{searchTerm}"
          </div>
        )}

        {/* Stats */}
        <div className="pt-4 border-t grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {Object.keys(TAG_MAPPING).length}
            </div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {Object.values(TAG_MAPPING).flat().length}
            </div>
            <div className="text-xs text-muted-foreground">Total Tags</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {(Object.values(TAG_MAPPING).flat().length / Object.keys(TAG_MAPPING).length).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Avg per Category</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
