
import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { OrganMap } from "@/components/OrganMap";
import { EraTimeline } from "@/components/EraTimeline";
import { ThinkerDetailModal } from "@/components/ThinkerDetailModal";
import { EnhancedThinkerModal } from "@/components/EnhancedThinkerModal";
import { SearchBar } from "@/components/SearchBar";
import { EraNavigation } from "@/components/EraNavigation";
import { AllThinkersGrid } from "@/components/AllThinkersGrid";
import { TopThinkersPanel } from "@/components/TopThinkersPanel";
import { EnhancedOrganMap } from "@/components/EnhancedOrganMap";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { THINKERS, type Lobe } from "@/data/thinkers";
import { ERAS } from "@/data/eras";
import { useFavorites } from "@/context/FavoritesContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Home, Compass, Settings } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [selectedThinker, setSelectedThinker] = useState<any>(null);
  const [selectedEra, setSelectedEra] = useState("genAI");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLobe, setSelectedLobe] = useState<Lobe | "All">("All");
  const [currentView, setCurrentView] = useState<'map' | 'timeline' | 'grid' | 'enhanced'>('grid');
  const [useEnhancedModal, setUseEnhancedModal] = useState(true);
  const { showFavoritesOnly } = useFavorites();

  const filteredThinkers = useMemo(() => {
    return THINKERS.filter(thinker => {
      const matchesSearch = thinker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           thinker.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           thinker.coreIdea.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           thinker.aiShift.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLobe = selectedLobe === "All" || thinker.lobe === selectedLobe;
      
      return matchesSearch && matchesLobe;
    });
  }, [searchTerm, selectedLobe]);

  const currentEra = ERAS.find(era => era.id === selectedEra);

  const handleThinkerSelect = (thinker: any) => {
    setSelectedThinker(thinker);
  };

  useEffect(() => {
    if (selectedThinker && !useEnhancedModal) {
      setUseEnhancedModal(true);
    }
  }, [selectedThinker]);

  return (
    <>
      <Helmet>
        <title>Tech4Humanity - Leaders Live Forever</title>
        <meta name="description" content="Explore how our favourite thinkers' frameworks evolve and apply across different domains and contexts" />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/" />
        <meta property="og:title" content="Tech4Humanity - Leaders Live Forever" />
        <meta property="og:description" content="Explore how our favourite thinkers' frameworks evolve and apply across different domains and contexts" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-thinker-flux.lovable.app/" />
        <meta property="og:image" content="https://ai-thinker-flux.lovable.app/og-share.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tech4Humanity - Leaders Live Forever" />
        <meta name="twitter:description" content="Explore how our favourite thinkers' frameworks evolve and apply across different domains and contexts" />
        <meta name="twitter:image" content="https://ai-thinker-flux.lovable.app/og-share.jpg" />
        <script type="module" src="/assets/thinker-card.js"></script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        {/* Navigation Header */}
        <div className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/T4H%20Logo%201.jpg" 
                    alt="Tech4Humanity logo" 
                    className="h-12 w-12 rounded-lg object-contain" 
                  />
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Tech4Humanity
                  </span>
                </div>
                
                <nav className="hidden md:flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/favorites")}
                    className="flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Crowd Sourced thinkers
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/add-thinker")}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add your own guru
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/governance")}
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Governance
                  </Button>
                </nav>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Leaders Live Forever
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Explore how our favourite thinkers' frameworks evolve and apply across different domains and contexts
            </p>
            <div className="flex justify-center">
              <Button 
                asChild 
                variant="outline" 
                className="gap-2 bg-white/50 dark:bg-gray-800/50 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              >
                <Link to="/add-thinker">
                  <Plus className="w-4 h-4" />
                  Add your own — discuss in real time the effects of new frameworks across teams, workfamilies, and governance.
                </Link>
              </Button>
            </div>
          </div>

          <SearchBar 
            query={searchTerm}
            onQueryChange={setSearchTerm}
            selectedLobe={selectedLobe}
            onLobeChange={setSelectedLobe}
          />

          {currentView === 'map' && (
            <OrganMap 
              selected={selectedLobe} 
              onSelect={setSelectedLobe}
            />
          )}


          {currentView === 'timeline' && (
            <EraTimeline />
          )}

          {currentView === 'grid' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <AllThinkersGrid />
                <div className="mt-6">
                  <div dangerouslySetInnerHTML={{
                    __html: '<thinker-card data-src="/data/kahneman.json"></thinker-card>'
                  }} />
                </div>
              </div>
              <div className="lg:col-span-1">
                <TopThinkersPanel 
                  thinkers={filteredThinkers}
                  onThinkerSelect={(name: string) => {
                    const thinker = THINKERS.find(t => t.name === name);
                    if (thinker) handleThinkerSelect(thinker);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <Footer />

        {selectedThinker && (
          <EnhancedThinkerModal
            thinker={selectedThinker}
            isOpen={!!selectedThinker}
            onClose={() => setSelectedThinker(null)}
          />
        )}
      </div>
    </>
  );
};

export default Index;
