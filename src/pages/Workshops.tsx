import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Presentation } from "lucide-react";

const Workshops = () => {
  return (
    <>
      <Helmet>
        <title>Workshops - Tech4Humanity Interactive Learning</title>
        <meta name="description" content="Interactive workshops on AI governance, framework implementation, team alignment, and transformation strategies." />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/resources/workshops" />
        <meta property="og:title" content="Workshops - Tech4Humanity Interactive Learning" />
        <meta property="og:description" content="Interactive workshops on AI governance, framework implementation, and team alignment." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-thinker-flux.lovable.app/resources/workshops" />
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
                <Presentation className="w-6 h-6 text-primary" />
                Workshops
              </h1>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Interactive Learning Workshops</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hands-on workshops designed to accelerate your AI transformation journey with practical, actionable insights.
            </p>
          </div>
          
          <div className="mt-12 p-8 bg-muted/20 rounded-lg text-center">
            <p className="text-muted-foreground">Coming soon - interactive workshops on AI governance, framework implementation, and team alignment strategies.</p>
          </div>
        </main>
      </div>
    </>
  );
};

export default Workshops;