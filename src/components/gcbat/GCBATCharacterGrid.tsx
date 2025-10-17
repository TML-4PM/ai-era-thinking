import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GCBATCharacter } from "@/types/gcbat";
import { GCBATCharacterCard } from "./GCBATCharacterCard";
import { GCBATCharacterModal } from "./GCBATCharacterModal";
import { Skeleton } from "@/components/ui/skeleton";

export const GCBATCharacterGrid = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<GCBATCharacter | null>(null);

  const { data: characters, isLoading } = useQuery({
    queryKey: ['gcbat-characters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gcbat_characters')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as GCBATCharacter[];
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters?.map((character) => (
          <GCBATCharacterCard
            key={character.id}
            character={character}
            onClick={() => setSelectedCharacter(character)}
          />
        ))}
      </div>

      {selectedCharacter && (
        <GCBATCharacterModal
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </>
  );
};
