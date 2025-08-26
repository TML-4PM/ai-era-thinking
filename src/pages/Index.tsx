import { Helmet } from "react-helmet-async";
import heroImage from "@/assets/hero-organ.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GlowField from "@/components/GlowField";
import { EraTimeline } from "@/components/EraTimeline";
import ThinkerCard from "@/components/ThinkerCard";
import SearchBar from "@/components/SearchBar";
import ThinkerDetailModal from "@/components/ThinkerDetailModal";
import Footer from "@/components/Footer";
import { THINKERS, type Lobe, type Thinker } from "@/data/thinkers";
import { getExpandedThinker } from "@/data/expanded-thinkers";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
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
    const l = searchParams.get("lobe");
    const e = searchParams.get("era");
    if (t) setSelectedThinker(t);
    if (l) setLobe(l as Lobe | "All"); else setLobe("All");
    if (e) setSelectedEra(e); else setSelectedEra("all");
  }, [searchParams]);

  const handleThinkerExplore = (name: string) => {
    setSelectedThinker(name);
    const sp = new URLSearchParams(searchParams);
    sp.set('thinker', name);
    setSearchParams(sp, { replace: true });
  };

  const handleLobeChange = (nextLobe: Lobe | "All") => {
    setLobe(nextLobe);
    const sp = new URLSearchParams(searchParams);
    if (nextLobe !== "All") sp.set('lobe', String(nextLobe)); else sp.delete('lobe');
    setSearchParams(sp, { replace: true });
  };

  const handleEraChange = (era: string) => {
    setSelectedEra(era);
    const sp = new URLSearchParams(searchParams);
    if (era && era !== "all") sp.set('era', era); else sp.delete('era');
    setSearchParams(sp, { replace: true });
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

      <main id="main" className="min-h-screen">
      <Helmet>
        <title>Agentic AI Organ Map – Top 50 Thinkers</title>
        <meta name="description" content="Explore the Agentic AI organ map with Top 50 thinkers, their lenses, and practical shifts. Download CSVs and use this as a working framework." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + '/' : '/'} />
        <meta property="og:title" content="Agentic AI Organ Map – Top 50 Thinkers" />
        <meta property="og:description" content="Explore the Agentic AI organ map with Top 50 thinkers, lenses, and practical shifts." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : 'https://ai-thinker-flux.lovable.app/'} />
        <meta property="og:image" content={typeof window !== 'undefined' ? window.location.origin + '/og-share.jpg' : '/og-share.jpg'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Agentic AI Organ Map – Top 50 Thinkers" />
        <meta name="twitter:description" content="Explore the Agentic AI organ map with Top 50 thinkers, lenses, and practical shifts." />
        <meta name="twitter:image" content={typeof window !== 'undefined' ? window.location.origin + '/og-share.jpg' : '/og-share.jpg'} />
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
              
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-hero opacity-20 blur-xl rounded-2xl"></div>
              <img 
                src={heroImage} 
                alt="The Organ Framework - Interactive AI transformation map" 
                loading="eager" fetchPriority="high" decoding="async"
                className="relative rounded-2xl shadow-2xl border glow-effect" 
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore 50 Famous Thinkers</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover how leading minds approach agentic AI and brain-computer interfaces. 
            Each thinker offers unique perspectives brought to life through interactive dialogues.
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Enhanced Search */}
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            selectedLobe={lobe}
            onLobeChange={handleLobeChange}
            selectedEra={selectedEra}
            onEraChange={handleEraChange}
          />
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
                handleLobeChange("All");
                handleEraChange("all");
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
    <Footer />
    </>
  );
};

export default Index;
