import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Tech4Humanity Legal Terms</title>
        <meta name="description" content="Tech4Humanity terms of service outlining user rights, responsibilities, and service usage guidelines." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/terms" />
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
                <FileText className="w-6 h-6 text-primary" />
                Terms of Service
              </h1>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-foreground">Terms of Service</h2>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <div className="bg-muted/20 p-6 rounded-lg">
                <p className="text-foreground">
                  Terms of service will be published here. These terms will outline user rights, responsibilities, acceptable use policies, and service limitations for Tech4Humanity platform usage.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Terms;