import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain } from "lucide-react";

const Thinkers = () => {
  return (
    <>
      <Helmet>
        <title>All Thinkers - Tech4Humanity Leaders Archive</title>
        <meta name="description" content="Browse our complete collection of influential thinkers and their transformative frameworks across all technology eras." />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/thinkers" />
        <meta property="og:title" content="All Thinkers - Tech4Humanity Leaders Archive" />
        <meta property="og:description" content="Browse our complete collection of influential thinkers and their transformative frameworks." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-thinker-flux.lovable.app/thinkers" />
        <meta property="og:image" content="https://ai-thinker-flux.lovable.app/og-share.jpg" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                All Thinkers
              </h1>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Complete Thinkers Archive</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive directory of influential thinkers and their frameworks across all technology eras.
            </p>
          </div>
          
          <div className="mt-12 p-8 bg-muted/20 rounded-lg text-center">
            <p className="text-muted-foreground">Coming soon - dedicated thinkers directory with advanced filtering and detailed profiles.</p>
          </div>
        </main>
      </div>
    </>
  );
};

export default Thinkers;