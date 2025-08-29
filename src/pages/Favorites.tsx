
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FavoritesList } from "@/components/FavoritesList";
import { EnhancedThinkerModal } from "@/components/EnhancedThinkerModal";
import { Button } from "@/components/ui/button";
import { Plus, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const [selectedThinker, setSelectedThinker] = useState<any>(null);
  const navigate = useNavigate();

  const handleThinkerSelect = (thinker: any) => {
    setSelectedThinker(thinker);
  };

  return (
    <>
      <Helmet>
        <title>Crowd Sourced Thinkers - AI-Era Thinking</title>
        <meta name="description" content="Community‑submitted thinkers and custom gurus" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                Crowd Sourced Thinkers
              </h1>
              <p className="text-muted-foreground mt-2">
                Community‑submitted thinkers and custom gurus
              </p>
            </div>
            
            <Button
              onClick={() => navigate("/add-thinker")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Guru
            </Button>
          </div>

          {/* Favorites List */}
          <FavoritesList onThinkerSelect={handleThinkerSelect} />

          {/* Thinker Modal */}
          <EnhancedThinkerModal
            thinker={selectedThinker}
            isOpen={!!selectedThinker}
            onClose={() => setSelectedThinker(null)}
          />
        </div>
      </div>
    </>
  );
};

export default Favorites;
