
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, HeartOff, User, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userThinkerService } from "@/services/UserThinkerService";
import { UserFavorite, UserThinker } from "@/types/UserThinker";
import { THINKERS } from "@/data/thinkers";

interface FavoritesListProps {
  onThinkerSelect?: (thinker: any) => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({ onThinkerSelect }) => {
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [userThinkers, setUserThinkers] = useState<UserThinker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadFavorites();
    loadUserThinkers();
  }, []);

  const loadFavorites = async () => {
    try {
      const { data, error } = await userThinkerService.getFavorites();
      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      });
    }
  };

  const loadUserThinkers = async () => {
    try {
      const { data, error } = await userThinkerService.getUserThinkers();
      if (error) throw error;
      setUserThinkers(data || []);
    } catch (error) {
      console.error('Error loading user thinkers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    setRemovingId(favoriteId);
    try {
      const { error } = await userThinkerService.removeFromFavorites(favoriteId);
      if (error) throw error;
      
      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
      toast({
        title: "Removed",
        description: "Thinker removed from favorites",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
    } finally {
      setRemovingId(null);
    }
  };

  const handleThinkerClick = (favorite: UserFavorite) => {
    if (favorite.thinker_name) {
      // Built-in thinker
      const builtInThinker = THINKERS.find(t => t.name === favorite.thinker_name);
      if (builtInThinker && onThinkerSelect) {
        onThinkerSelect(builtInThinker);
      }
    } else if (favorite.user_thinker_id) {
      // User-created thinker
      const userThinker = userThinkers.find(t => t.id === favorite.user_thinker_id);
      if (userThinker && onThinkerSelect) {
        // Convert UserThinker to Thinker format for compatibility
        onThinkerSelect({
          name: userThinker.name,
          area: userThinker.area,
          coreIdea: userThinker.core_idea,
          aiShift: userThinker.ai_shift,
          lobe: userThinker.lobe as any,
          isUserCreated: true,
          userThinkerData: userThinker
        });
      }
    }
  };

  const getLobeColor = (lobe: string) => {
    const colors = {
      "Decision/Action": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      "Innovation/Strategy": "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      "Ethics/Governance": "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      "Culture/Behaviour": "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
      "Perception/Patterning": "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    };
    return colors[lobe as keyof typeof colors] || "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">No favorites yet</h3>
        <p className="text-sm text-muted-foreground">
          Start exploring thinkers and add them to your favorites
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {favorites.map((favorite) => {
        const builtInThinker = favorite.thinker_name ? 
          THINKERS.find(t => t.name === favorite.thinker_name) : null;
        
        const userThinker = favorite.user_thinker_id ? 
          userThinkers.find(t => t.id === favorite.user_thinker_id) : null;

        const thinker = builtInThinker || userThinker;
        if (!thinker) return null;

        const name = builtInThinker ? builtInThinker.name : userThinker!.name;
        const area = builtInThinker ? builtInThinker.area : userThinker!.area;
        const lobe = builtInThinker ? builtInThinker.lobe : userThinker!.lobe;
        const coreIdea = builtInThinker ? builtInThinker.coreIdea : userThinker!.core_idea;
        const isUserCreated = !builtInThinker;

        return (
          <Card 
            key={favorite.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleThinkerClick(favorite)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                    <Badge 
                      className={`text-xs border ${getLobeColor(lobe)}`}
                      variant="outline"
                    >
                      {lobe}
                    </Badge>
                    {isUserCreated && (
                      <Badge className="text-xs bg-gradient-to-r from-green-500 to-teal-600 text-white border-0">
                        <User className="w-3 h-3 mr-1" />
                        Custom
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(favorite.id);
                  }}
                  disabled={removingId === favorite.id}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  {removingId === favorite.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <HeartOff className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {coreIdea}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
