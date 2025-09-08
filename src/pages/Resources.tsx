import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Presentation, FileText, ExternalLink } from "lucide-react";

const Resources = () => {
  return (
    <>
      <Helmet>
        <title>Resources - Tech4Humanity Learning Center</title>
        <meta name="description" content="Access workshops, case studies, whitepapers, and implementation guides for AI transformation and governance." />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/resources" />
        <meta property="og:title" content="Resources - Tech4Humanity Learning Center" />
        <meta property="og:description" content="Access workshops, case studies, whitepapers, and implementation guides for AI transformation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-thinker-flux.lovable.app/resources" />
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
                <BookOpen className="w-6 h-6 text-primary" />
                Resources
              </h1>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-foreground">Learning Resources</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive collection of workshops, case studies, and implementation guides for AI transformation success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Presentation className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Workshops</h3>
              <p className="text-muted-foreground mb-4">Interactive sessions on AI governance, framework implementation, and team alignment.</p>
              <Link to="/resources/workshops">
                <Button variant="default" className="w-full">
                  View Workshops <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Case Studies</h3>
              <p className="text-muted-foreground mb-4">Real-world examples of successful AI transformations and governance implementations.</p>
              <Link to="/resources/case-studies">
                <Button variant="default" className="w-full">
                  Browse Case Studies <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Implementation Guides</h3>
              <p className="text-muted-foreground mb-4">Step-by-step guides for implementing thinker frameworks and governance strategies.</p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default Resources;