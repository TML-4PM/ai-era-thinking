import { Helmet } from "react-helmet-async";
import heroImage from "@/assets/hero-organ.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import OrganMap from "@/components/OrganMap";
import GlowField from "@/components/GlowField";
import { THINKERS, type Lobe, type Thinker } from "@/data/thinkers";
import { useMemo, useState } from "react";

const Index = () => {
  const [query, setQuery] = useState("");
  const [lobe, setLobe] = useState<Lobe | "All">("All");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return THINKERS.filter((t) =>
      (lobe === "All" || t.lobe === lobe) &&
      (t.name.toLowerCase().includes(q) || t.area.toLowerCase().includes(q) || t.coreIdea.toLowerCase().includes(q) || t.aiShift.toLowerCase().includes(q))
    );
  }, [query, lobe]);

  return (
    <main className="min-h-screen">
      <Helmet>
        <title>Agentic AI Organ Map – Top 50 Thinkers</title>
        <meta name="description" content="Explore the Agentic AI organ map with Top 50 thinkers, their lenses, and practical shifts. Download CSVs and use this as a working framework." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + '/' : '/'} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Agentic AI Organ Map – Top 50 Thinkers",
          about: "Perception, Decision, Innovation, Ethics, Culture",
          isPartOf: { "@type": "WebSite", name: "ai-thinker-flux" }
        })}</script>
      </Helmet>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,hsl(var(--brand)/0.12),transparent_35%),radial-gradient(circle_at_80%_20%,hsl(var(--brand-2)/0.12),transparent_40%)]" />
        <GlowField />
        <div className="container relative py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Agentic AI Organ Map: Top 50 Thinkers</h1>
              <p className="text-muted-foreground text-lg mb-6">A practical, visual framework: map outcomes to lobes, pick a lens, make a small change, repeat. Use it for slides, strategy, or workshops.</p>
              <div className="flex flex-wrap gap-3">
                <a href="/organ_across_eras.csv" download>
                  <Button variant="hero">Download: Organ Across Eras</Button>
                </a>
                <a href="/architecture_guts_by_era.csv" download>
                  <Button variant="outline">Architecture Guts (CSV)</Button>
                </a>
                <a href="/governance_risks_metrics.csv" download>
                  <Button variant="outline">Governance & Metrics (CSV)</Button>
                </a>
                <a href="/expansion_backlog.csv" download>
                  <Button variant="outline">Expansion Backlog (CSV)</Button>
                </a>
              </div>
            </div>
            <div className="relative">
              <img src={heroImage} alt="Abstract organ map of agentic AI lobes with neon gradient" loading="lazy" className="rounded-xl shadow-2xl border" />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <Card>
          <CardHeader>
            <CardTitle>Explore the Organ</CardTitle>
          </CardHeader>
          <CardContent>
            <OrganMap selected={lobe} onSelect={setLobe} className="mb-6" />
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">Filter</Badge>
                <Button size="sm" variant={lobe === "All" ? "default" : "secondary"} onClick={() => setLobe("All")}>All</Button>
                <Button size="sm" variant={lobe === "Perception/Patterning" ? "default" : "secondary"} onClick={() => setLobe("Perception/Patterning")}>Perception</Button>
                <Button size="sm" variant={lobe === "Decision/Action" ? "default" : "secondary"} onClick={() => setLobe("Decision/Action")}>Decision</Button>
                <Button size="sm" variant={lobe === "Innovation/Strategy" ? "default" : "secondary"} onClick={() => setLobe("Innovation/Strategy")}>Innovation</Button>
                <Button size="sm" variant={lobe === "Ethics/Governance" ? "default" : "secondary"} onClick={() => setLobe("Ethics/Governance")}>Ethics</Button>
                <Button size="sm" variant={lobe === "Culture/Behaviour" ? "default" : "secondary"} onClick={() => setLobe("Culture/Behaviour")}>Culture</Button>
              </div>
              <div className="md:w-80">
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search thinkers, ideas, shifts" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="container pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t: Thinker) => (
            <Card key={t.name} className="transition-transform hover:-translate-y-0.5">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t.name}</span>
                  <Badge>{t.lobe.split("/")[0]}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">{t.area} — {t.coreIdea}</div>
                <div>
                  <span className="text-sm font-medium">AI Shift:</span>
                  <p className="text-sm text-muted-foreground mt-1">{t.aiShift}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground mt-10">No matches. Try a different term or lobe.</p>
        )}
      </section>
    </main>
  );
};

export default Index;
