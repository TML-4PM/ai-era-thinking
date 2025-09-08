import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";

const WorkFamily = () => {
  return (
    <>
      <Helmet>
        <title>WorkFamily AI - Tech4Humanity Team Alignment</title>
        <meta name="description" content="AI-powered team alignment and workfamily dynamics optimization for organizational transformation and governance." />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/workfamily" />
        <meta property="og:title" content="WorkFamily AI - Tech4Humanity Team Alignment" />
        <meta property="og:description" content="AI-powered team alignment and workfamily dynamics optimization." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-thinker-flux.lovable.app/workfamily" />
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
                <Users className="w-6 h-6 text-primary" />
                WorkFamily AI
              </h1>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground">AI-Powered Team Alignment</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Optimize workfamily dynamics and team alignment for successful AI transformation and governance implementation.
            </p>
          </div>
          
          <div className="mt-12 p-8 bg-muted/20 rounded-lg text-center">
            <p className="text-muted-foreground">Coming soon - comprehensive workfamily alignment tools and AI-powered team optimization platform.</p>
          </div>
        </main>
      </div>
    </>
  );
};

export default WorkFamily;