import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { GCBATCharacter } from "@/types/gcbat";
import { User } from "lucide-react";

interface GCBATCharacterModalProps {
  character: GCBATCharacter;
  onClose: () => void;
}

export const GCBATCharacterModal = ({ character, onClose }: GCBATCharacterModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={character.portrait_url} alt={character.name} />
              <AvatarFallback>
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>{character.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{character.role}</p>
              {character.gcbat_unit_alignment && (
                <Badge variant="secondary" className="mt-2">
                  {character.gcbat_unit_alignment}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {character.background && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Background</h3>
                <p className="text-muted-foreground">{character.background}</p>
              </div>
            )}

            {character.character_arc && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Character Arc</h3>
                  <p className="text-muted-foreground">{character.character_arc}</p>
                </div>
              </>
            )}

            {character.appearance && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Appearance</h3>
                  <p className="text-muted-foreground">{character.appearance}</p>
                </div>
              </>
            )}

            {character.voice_style && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Voice & Style</h3>
                  <p className="text-muted-foreground">{character.voice_style}</p>
                </div>
              </>
            )}

            {character.relationships && Object.keys(character.relationships).length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Relationships</h3>
                  <div className="space-y-2">
                    {Object.entries(character.relationships).map(([person, relationship]) => (
                      <div key={person} className="text-sm">
                        <span className="font-medium">{person}:</span>{' '}
                        <span className="text-muted-foreground">{relationship}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
