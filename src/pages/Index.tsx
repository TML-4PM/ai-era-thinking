
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
        <title>AI-Era Thinking - Leaders Live Forever</title>
        <meta name="description" content="Explore how our favourite thinkers' frameworks evolve and apply in the age of artificial intelligence" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        {/* Navigation Header */}
        <div className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">O</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Organ Framework
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
                AI-Era Thinking - Leaders Live Forever
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Explore how our favourite thinkers' frameworks evolve and apply in the age of artificial intelligence
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50">
                5 Cognitive Lobes
              </Badge>
              <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50">
                Cross-Era Analysis
              </Badge>
            </div>
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

          <div className="mb-6">
            <EraNavigation />
          </div>

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
