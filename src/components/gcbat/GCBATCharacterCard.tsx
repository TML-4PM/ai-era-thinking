import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GCBATCharacter } from "@/types/gcbat";
import { User } from "lucide-react";

interface GCBATCharacterCardProps {
  character: GCBATCharacter;
  onClick?: () => void;
}

export const GCBATCharacterCard = ({ character, onClick }: GCBATCharacterCardProps) => {
  const initials = character.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="text-center pb-3">
        <Avatar className="w-24 h-24 mx-auto mb-3">
          <AvatarImage src={character.portrait_url} alt={character.name} />
          <AvatarFallback>
            <User className="w-12 h-12" />
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-lg">{character.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{character.role}</p>
      </CardHeader>
      <CardContent className="text-center">
        {character.gcbat_unit_alignment && (
          <Badge variant="secondary">{character.gcbat_unit_alignment}</Badge>
        )}
      </CardContent>
    </Card>
  );
};
