import { Helmet } from "react-helmet-async";
import heroImage from "@/assets/hero-organ.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EnhancedOrganMap from "@/components/EnhancedOrganMap";
import GlowField from "@/components/GlowField";
import { EraTimeline } from "@/components/EraTimeline";
import ThinkerCard from "@/components/ThinkerCard";
import SearchBar from "@/components/SearchBar";
import ThinkerDetailModal from "@/components/ThinkerDetailModal";
import { THINKERS, type Lobe, type Thinker } from "@/data/thinkers";
import { getExpandedThinker } from "@/data/expanded-thinkers";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { Download, ExternalLink, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const [query, setQuery] = useState("");
  const [lobe, setLobe] = useState<Lobe | "All">("All");
  const [selectedEra, setSelectedEra] = useState("all");
  const [selectedThinker, setSelectedThinker] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return THINKERS.filter((t) =>
      (lobe === "All" || t.lobe === lobe) &&
      (t.name.toLowerCase().includes(q) || t.area.toLowerCase().includes(q) || t.coreIdea.toLowerCase().includes(q) || t.aiShift.toLowerCase().includes(q))
    );
  }, [query, lobe]);

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const t = searchParams.get("thinker");
    if (t) setSelectedThinker(t);
  }, [searchParams]);

  const handleThinkerExplore = (name: string) => {
    setSelectedThinker(name);
    setSearchParams({ thinker: name }, { replace: true });
  };

  const expandedThinker = selectedThinker ? getExpandedThinker(selectedThinker) : null;

  const handleCloseModal = () => {
    setSelectedThinker(null);
    if (searchParams.get('thinker')) {
      const sp = new URLSearchParams(searchParams);
      sp.delete('thinker');
      setSearchParams(sp, { replace: true });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-14 flex items-center justify-between">
          <Link to="/" className="font-semibold">The Organ Framework</Link>
          <nav className="flex items-center gap-3">
            <Link to="/governance" className="text-sm hover:underline">Governance</Link>
            <Link to="/tools" className="text-sm hover:underline">Tools</Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

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
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <GlowField />
        <div className="container relative py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-gradient-warm text-white">
                  Enhanced Framework v2.0
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-hero bg-clip-text text-transparent">
                  The Organ Framework
                </h1>
                <p className="text-muted-foreground text-xl mb-8 leading-relaxed">
                  Navigate AI transformation with 50+ thinkers, interactive maps, and practical tools. 
                  From strategy to implementation—your complete guide to agentic AI adoption.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <a href="/organ_across_eras.csv" download>
                    <Button variant="hero" className="btn-enhanced">
                      <Download className="h-4 w-4 mr-2" />
                      Core Framework (CSV)
                    </Button>
                  </a>
                  <Link to="/tools">
                    <Button className="bg-gradient-warm btn-enhanced">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Implementation Tools
                    </Button>
                  </Link>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <a href="/architecture_guts_by_era.csv" download>
                    <Button variant="outline" size="sm" className="btn-enhanced">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Architecture Data
                    </Button>
                  </a>
                  <a href="/governance_risks_metrics.csv" download>
                    <Button variant="outline" size="sm" className="btn-enhanced">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Governance Metrics
                    </Button>
                  </a>
                  <Link to="/governance">
                    <Button variant="outline" size="sm" className="btn-enhanced">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Risk Framework
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-hero opacity-20 blur-xl rounded-2xl"></div>
              <img 
                src={heroImage} 
                alt="The Organ Framework - Interactive AI transformation map" 
                loading="lazy" 
                className="relative rounded-2xl shadow-2xl border glow-effect" 
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Interactive Exploration</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Navigate through 5 key capability areas and discover how leading thinkers' insights 
            transform in the age of agentic AI.
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Enhanced Search */}
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            selectedLobe={lobe}
            onLobeChange={setLobe}
            selectedEra={selectedEra}
            onEraChange={setSelectedEra}
          />
          
          {/* Enhanced Organ Map */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    The Organ Map
                    <Badge variant="secondary" className="bg-gradient-warm text-white">
                      Interactive
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <EnhancedOrganMap 
                    selected={lobe} 
                    onSelect={setLobe}
                    selectedEra={selectedEra}
                    onEraSelect={setSelectedEra}
                    showEraOverlay={true}
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Era Evolution</CardTitle>
              </CardHeader>
              <CardContent>
                <EraTimeline />
                <div className="mt-6 p-4 bg-gradient-subtle rounded-lg">
                  <h4 className="font-medium mb-2">Framework Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Thinkers:</span>
                      <Badge variant="outline">{THINKERS.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Current View:</span>
                      <Badge variant="outline">{filtered.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Filters:</span>
                      <Badge variant="outline">
                        {lobe !== "All" ? 1 : 0} + {selectedEra !== "all" ? 1 : 0}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Thinker Profiles {filtered.length < THINKERS.length && `(${filtered.length} of ${THINKERS.length})`}
          </h2>
          <p className="text-muted-foreground">
            Each thinker brings unique insights that transform in the agentic AI era. 
            Click "Explore Deep Profile" for expanded analysis and practical applications.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t: Thinker) => (
            <ThinkerCard 
              key={t.name} 
              thinker={t} 
              onExplore={handleThinkerExplore}
              className="interactive-hover"
            />
          ))}
        </div>
        
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium mb-2">No matches found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters to discover relevant thinkers.
              </p>
              <Button onClick={() => {
                setQuery("");
                setLobe("All");
                setSelectedEra("all");
              }}>
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Thinker Detail Modal */}
      <ThinkerDetailModal
        isOpen={!!selectedThinker}
        onClose={handleCloseModal}
        thinker={expandedThinker}
      />
    </main>
    </>
  );
};

export default Index;
