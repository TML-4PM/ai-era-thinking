import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, X, Filter } from "lucide-react";
import { THINKERS, type Lobe } from "@/data/thinkers";
import { ERAS } from "@/data/eras";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedLobe: Lobe | "All";
  onLobeChange: (lobe: Lobe | "All") => void;
  selectedEra?: string;
  onEraChange?: (era: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  selectedLobe,
  onLobeChange,
  selectedEra = "all",
  onEraChange,
  className
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Generate search suggestions
  const suggestions = useMemo(() => {
    const thinkerNames = THINKERS.map(t => t.name);
    const areas = [...new Set(THINKERS.map(t => t.area))];
    const concepts = [...new Set(THINKERS.map(t => t.coreIdea.split(",")[0].trim()))];
    
    return [
      ...thinkerNames.map(name => ({ type: "thinker", value: name })),
      ...areas.map(area => ({ type: "area", value: area })),
      ...concepts.map(concept => ({ type: "concept", value: concept }))
    ].filter(item => 
      item.value.toLowerCase().includes(query.toLowerCase()) && query.length > 1
    ).slice(0, 8);
  }, [query]);

  const activeFilters = [
    selectedLobe !== "All" && selectedLobe,
    selectedEra && selectedEra !== "all" && ERAS.find(e => e.id === selectedEra)?.shortName
  ].filter(Boolean);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Enhanced Search Input */}
      <div className="relative">
        <Popover open={isSearchOpen && suggestions.length > 0} onOpenChange={setIsSearchOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  onQueryChange(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search thinkers, ideas, concepts..."
                className="pl-10 pr-10 bg-gradient-subtle border-2 hover:border-brand/30 focus:border-brand/50 transition-colors"
              />
              {query && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => {
                    onQueryChange("");
                    setIsSearchOpen(false);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </PopoverTrigger>
          
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  {suggestions.map((suggestion, idx) => (
                    <CommandItem
                      key={idx}
                      onSelect={() => {
                        onQueryChange(suggestion.value);
                        setIsSearchOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {suggestion.type}
                        </Badge>
                        {suggestion.value}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

    </div>
  );
};

export default SearchBar;