import { GCBATCharacterGrid } from "@/components/gcbat/GCBATCharacterGrid";

export default function GCBATCharactersPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold">The Neural Ennead</h2>
        <p className="text-lg text-muted-foreground">
          Nine professionals navigating Brain-Computer Interface governance across the GCBAT framework—
          from neural ethics and cognitive privacy to BCI architecture and neurotechnology policy.
        </p>
      </div>

      <GCBATCharacterGrid />
    </div>
  );
}
