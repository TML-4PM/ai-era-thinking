import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calculator, TrendingUp, Shield, Zap } from "lucide-react";

const Calculators = () => {
  const calculators = [
    {
      title: "AI Readiness Assessment",
      description: "Evaluate your organization's readiness for AI transformation across all dimensions.",
      icon: <TrendingUp className="w-6 h-6" />,
      status: "Available"
    },
    {
      title: "Governance Risk Calculator",
      description: "Quantify governance risks and compliance requirements for your AI initiatives.",
      icon: <Shield className="w-6 h-6" />,
      status: "Coming Soon"
    },
    {
      title: "ROI Impact Estimator",
      description: "Calculate potential returns and impacts of thinker framework implementation.",
      icon: <Zap className="w-6 h-6" />,
      status: "Coming Soon"
    }
  ];

  return (
    <>
      <Helmet>
        <title>AI Calculators - Tech4Humanity Assessment Tools</title>
        <meta name="description" content="Free AI readiness assessments, governance risk calculators, and ROI estimators for transformation planning." />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/calculators" />
        <meta property="og:title" content="AI Calculators - Tech4Humanity Assessment Tools" />
        <meta property="og:description" content="Free AI readiness assessments, governance risk calculators, and ROI estimators." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-thinker-flux.lovable.app/calculators" />
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
                <Calculator className="w-6 h-6 text-primary" />
                AI Calculators
              </h1>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-foreground">Assessment & Planning Tools</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Free calculators and assessment tools to help you plan and measure your AI transformation journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.map((calc, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {calc.icon}
                  </div>
                  <div className="text-sm text-muted-foreground">{calc.status}</div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{calc.title}</h3>
                <p className="text-muted-foreground mb-4">{calc.description}</p>
                <Button 
                  variant={calc.status === "Available" ? "default" : "outline"} 
                  disabled={calc.status !== "Available"}
                  className="w-full"
                >
                  {calc.status === "Available" ? "Start Assessment" : "Coming Soon"}
                </Button>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default Calculators;