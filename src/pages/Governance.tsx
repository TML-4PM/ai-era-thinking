import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GOVERNANCE_PRINCIPLES, RISK_PROFILES, FAILURE_CASES, REGULATORY_PRESSURES } from "@/data/governance";
import { ArrowLeft, Shield, AlertTriangle, FileText, Scale, Zap, Target } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export const Governance: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Governance & Safety | The Organ - AI Transformation Framework</title>
        <meta name="description" content="Comprehensive governance and safety framework for AI transformation. Context integrity, provenance tracking, guardrails as code, and reflex stops across all technology eras." />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/governance" />
        <meta property="og:title" content="Governance & Safety | The Organ" />
        <meta property="og:description" content="Comprehensive governance and safety framework for AI transformation." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://ai-thinker-flux.lovable.app/governance" />
        <meta property="og:image" content="https://ai-thinker-flux.lovable.app/og-share.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Governance & Safety | The Organ" />
        <meta name="twitter:description" content="Comprehensive governance and safety framework for AI transformation." />
        <meta name="twitter:image" content="https://ai-thinker-flux.lovable.app/og-share.jpg" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Organ Map
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-foreground">Governance & Safety</h1>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main id="main" className="container mx-auto px-4 py-8 space-y-12">
          {/* Hero */}
          <section className="text-center space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-primary">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">Governance & Safety Framework</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Governance in the Organ isn't a compliance tick-box. It's the difference between a system that scales and a system that collapses under its own automation. When the pace of action outstrips the pace of human oversight, governance must move into the guts — as executable code, live metrics, and reflex stops.
            </p>
          </section>

          {/* Core Principles */}
          <section>
            <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-brand" />
              Core Governance Principles
            </h3>
            <div className="grid gap-6">
              {GOVERNANCE_PRINCIPLES.map((principle) => (
                <Card key={principle.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-brand/10">
                      <Shield className="w-5 h-5 text-brand" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-foreground mb-2">{principle.name}</h4>
                      <p className="text-foreground mb-4">{principle.description}</p>
                      
                      <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                        <h5 className="text-sm font-medium text-foreground mb-2">Implementation:</h5>
                        <p className="text-sm text-muted-foreground">{principle.implementation}</p>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-foreground mb-2">Examples:</h5>
                        <ul className="space-y-1">
                          {principle.examples.map((example, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-muted-foreground">{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Era-Specific Risk Profiles */}
          <section>
            <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              Era-Specific Risk Profiles
            </h3>
            <div className="grid gap-4">
              {RISK_PROFILES.map((risk, index) => (
                <Card key={index} className="p-4">
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    <div>
                      <Badge variant="outline" className="mb-2">{risk.era}</Badge>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-1">Risk</h5>
                      <p className="text-sm text-muted-foreground">{risk.risk}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-1">Control</h5>
                      <p className="text-sm text-muted-foreground">{risk.control}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-1">Metric</h5>
                      <p className="text-sm text-muted-foreground">{risk.metric}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Failure Cases */}
          <section>
            <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-brand" />
              Failure Cases and Lessons
            </h3>
            <div className="grid gap-6">
              {FAILURE_CASES.map((failure) => (
                <Card key={failure.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-destructive/10">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="text-lg font-semibold text-foreground">{failure.title}</h4>
                        <Badge variant="outline">{failure.era}</Badge>
                      </div>
                      
                      <p className="text-foreground mb-4">{failure.scenario}</p>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-3 bg-destructive/5 rounded-lg">
                          <h5 className="text-sm font-medium text-destructive mb-1">What Went Wrong</h5>
                          <p className="text-sm text-muted-foreground">{failure.whatWentWrong}</p>
                        </div>
                        
                        <div className="p-3 bg-green-500/5 rounded-lg">
                          <h5 className="text-sm font-medium text-green-600 mb-1">Prevention</h5>
                          <p className="text-sm text-muted-foreground">{failure.prevention}</p>
                        </div>
                        
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <h5 className="text-sm font-medium text-foreground mb-1">Impact</h5>
                          <p className="text-sm text-muted-foreground">{failure.impact}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Regulatory Pressures */}
          <section>
            <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Scale className="w-6 h-6 text-brand" />
              Regulatory Pressure Points
            </h3>
            <div className="grid gap-4">
              {REGULATORY_PRESSURES.map((pressure, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{pressure.era}</Badge>
                    <p className="text-foreground">{pressure.pressure}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* In-Band Governance */}
          <Card className="p-8 bg-gradient-to-r from-brand/5 to-brand-2/5 border-brand/20">
            <h3 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-brand" />
              Why Governance Must Be In-Band
            </h3>
            <p className="text-lg text-foreground leading-relaxed mb-4">
              Governance only works if it happens at the speed of the system it's governing. In agentic and neural systems, that means in-band: part of the decision loop itself, not an afterthought.
            </p>
            <div className="p-4 bg-card/80 rounded-lg border border-border">
              <p className="text-foreground italic">
                If your kill switch lives on a human dashboard while your agent executes in milliseconds, you don't have a kill switch — you have a placebo.
              </p>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center gap-4 pt-8">
            <Link to="/">
              <Button variant="outline">
                Back to Organ Map
              </Button>
            </Link>
            <Link to="/era/agentic-ai">
              <Button className="btn-hero">
                Explore Agentic AI Era →
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default Governance;