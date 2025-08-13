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

      {/* Filter Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilters.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilters.length}
            </Badge>
          )}
        </Button>

        {/* Active Filters Display */}
        {activeFilters.map((filter, idx) => (
          <Badge key={idx} variant="secondary" className="flex items-center gap-1">
            {filter}
            <Button
              size="sm"
              variant="ghost"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => {
                if (selectedLobe !== "All" && filter === selectedLobe) {
                  onLobeChange("All");
                } else if (selectedEra && selectedEra !== "all") {
                  onEraChange?.("all");
                }
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {activeFilters.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              onLobeChange("All");
              onEraChange?.("all");
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Expanded Filter Panel */}
      {showFilters && (
        <div className="bg-card border rounded-lg p-4 space-y-4">
          <div>
            <h4 className="font-medium mb-2">Lobe Focus</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedLobe === "All" ? "default" : "outline"}
                onClick={() => onLobeChange("All")}
              >
                All Lobes
              </Button>
              {(["Perception/Patterning", "Decision/Action", "Innovation/Strategy", "Ethics/Governance", "Culture/Behaviour"] as Lobe[]).map((lobe) => (
                <Button
                  key={lobe}
                  size="sm"
                  variant={selectedLobe === lobe ? "default" : "outline"}
                  onClick={() => onLobeChange(lobe)}
                >
                  {lobe.split("/")[0]}
                </Button>
              ))}
            </div>
          </div>

          {onEraChange && (
            <div>
              <h4 className="font-medium mb-2">Era Focus</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={selectedEra === "all" ? "default" : "outline"}
                  onClick={() => onEraChange("all")}
                >
                  All Eras
                </Button>
                {ERAS.map((era) => (
                  <Button
                    key={era.id}
                    size="sm"
                    variant={selectedEra === era.id ? "default" : "outline"}
                    onClick={() => onEraChange(era.id)}
                  >
                    {era.shortName}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;