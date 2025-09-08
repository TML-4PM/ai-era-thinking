import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About - Tech4Humanity Mission & Vision</title>
        <meta name="description" content="Learn about Tech4Humanity's mission to preserve and apply transformative thinking for AI-era governance and organizational evolution." />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/about" />
        <meta property="og:title" content="About - Tech4Humanity Mission & Vision" />
        <meta property="og:description" content="Learn about Tech4Humanity's mission to preserve transformative thinking for AI-era governance." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-thinker-flux.lovable.app/about" />
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
                <Info className="w-6 h-6 text-primary" />
                About Tech4Humanity
              </h1>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-foreground">Our Mission</h2>
              <p className="text-xl text-muted-foreground">
                Preserving and applying transformative thinking for the AI era
              </p>
            </div>
            
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="text-foreground leading-relaxed">
                Tech4Humanity is dedicated to preserving the wisdom of transformative thinkers and making their frameworks accessible for modern AI governance and organizational evolution. We believe that the greatest insights from human history can guide us through the complexities of artificial intelligence implementation.
              </p>
              
              <h3 className="text-2xl font-semibold text-foreground">Our Vision</h3>
              <p className="text-foreground leading-relaxed">
                A world where AI transformation is guided by proven human wisdom, ensuring that technology serves humanity's highest aspirations while maintaining ethical governance and sustainable progress.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default About;