import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";

const CaseStudies = () => {
  return (
    <>
      <Helmet>
        <title>Case Studies - Tech4Humanity Success Stories</title>
        <meta name="description" content="Real-world case studies of successful AI transformations, governance implementations, and framework applications." />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/resources/case-studies" />
        <meta property="og:title" content="Case Studies - Tech4Humanity Success Stories" />
        <meta property="og:description" content="Real-world case studies of successful AI transformations and governance implementations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-thinker-flux.lovable.app/resources/case-studies" />
        <meta property="og:image" content="https://ai-thinker-flux.lovable.app/og-share.jpg" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link to="/resources">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Resources
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Case Studies
              </h1>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Success Stories & Case Studies</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn from real-world implementations of AI transformation and governance frameworks across various organizations.
            </p>
          </div>
          
          <div className="mt-12 p-8 bg-muted/20 rounded-lg text-center">
            <p className="text-muted-foreground">Coming soon - detailed case studies showcasing successful AI transformations and governance implementations.</p>
          </div>
        </main>
      </div>
    </>
  );
};

export default CaseStudies;