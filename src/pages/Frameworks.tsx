import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target } from "lucide-react";

const Frameworks = () => {
  return (
    <>
      <Helmet>
        <title>Frameworks - Tech4Humanity Methodologies</title>
        <meta name="description" content="Explore powerful frameworks for AI transformation, governance, and organizational change across technology eras." />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/frameworks" />
        <meta property="og:title" content="Frameworks - Tech4Humanity Methodologies" />
        <meta property="og:description" content="Explore powerful frameworks for AI transformation, governance, and organizational change." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-thinker-flux.lovable.app/frameworks" />
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
                <Target className="w-6 h-6 text-primary" />
                Frameworks
              </h1>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Transformation Frameworks</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Proven methodologies for AI transformation, governance implementation, and organizational evolution.
            </p>
          </div>
          
          <div className="mt-12 p-8 bg-muted/20 rounded-lg text-center">
            <p className="text-muted-foreground">Coming soon - comprehensive framework library with implementation guides and case studies.</p>
          </div>
        </main>
      </div>
    </>
  );
};

export default Frameworks;