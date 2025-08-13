import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getEraById } from "@/data/eras";
import { THINKERS } from "@/data/thinkers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EraNavigation } from "@/components/EraNavigation";
import { ArrowLeft, Calendar, Users, Zap, AlertTriangle, CheckCircle, Target } from "lucide-react";

export const EraDetail: React.FC = () => {
  const { eraId } = useParams();
  const era = eraId ? getEraById(eraId) : null;

  if (!era) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Era Not Found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relevantThinkers = Object.entries(era.lobeBreakdowns).reduce((acc, [lobe, breakdown]) => {
    const thinkerObjects = breakdown.thinkers.map(name => 
      THINKERS.find(t => t.name === name)
    ).filter(Boolean);
    acc[lobe] = thinkerObjects;
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      <Helmet>
        <title>{era.name} | The Organ - AI Transformation Framework</title>
        <meta name="description" content={`Deep dive into the ${era.name}: ${era.description}. ${era.context.substring(0, 150)}...`} />
        <link rel="canonical" href={`https://ai-thinker-flux.lovable.app/era/${era.id}`} />
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
                <h1 className="text-2xl font-bold text-foreground">{era.name}</h1>
              </div>
              <EraNavigation />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-12">
          {/* Era Hero */}
          <section className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge variant="outline" className="text-sm">
                <Calendar className="w-3 h-3 mr-1" />
                {era.timeframe}
              </Badge>
              <Badge className="bg-gradient-primary text-primary-foreground">
                {era.description}
              </Badge>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-2">{era.shortName}</h2>
            <p className="text-xl text-muted-foreground italic max-w-3xl mx-auto">
              {era.culturalPosture}
            </p>
          </section>

          {/* Context */}
          <Card className="p-8">
            <h3 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-brand" />
              The Context
            </h3>
            <p className="text-lg text-foreground leading-relaxed">
              {era.context}
            </p>
          </Card>

          {/* Drivers and What Broke It */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Drivers
              </h3>
              <ul className="space-y-3">
                {era.drivers.map((driver, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand mt-2 flex-shrink-0"></div>
                    <span className="text-foreground">{driver}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                What Broke It
              </h3>
              <ul className="space-y-3">
                {era.whatBrokeIt.map((issue, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0"></div>
                    <span className="text-foreground">{issue}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Lobe Breakdown */}
          <section>
            <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-brand" />
              Lobe-by-Lobe Analysis
            </h3>
            <div className="grid gap-6">
              {Object.entries(era.lobeBreakdowns).map(([lobe, breakdown]) => (
                <Card key={lobe} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-foreground">{lobe}</h4>
                    <Badge variant="outline">
                      <Users className="w-3 h-3 mr-1" />
                      {breakdown.thinkers.length} thinkers
                    </Badge>
                  </div>
                  <p className="text-foreground mb-4">{breakdown.description}</p>
                  
                  {relevantThinkers[lobe] && relevantThinkers[lobe].length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <h5 className="text-sm font-medium text-muted-foreground mb-3">Key Thinkers:</h5>
                      <div className="flex flex-wrap gap-2">
                        {relevantThinkers[lobe].map((thinker) => (
                          <Link key={thinker.name} to={`/?thinker=${encodeURIComponent(thinker.name)}`}>
                            <Badge variant="secondary" className="hover:bg-accent cursor-pointer transition-colors">
                              {thinker.name}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>

          {/* Operational Guts */}
          <section>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Operational Guts</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(era.operationalGuts).map(([plane, description]) => (
                <Card key={plane} className="p-4">
                  <h4 className="font-semibold text-foreground mb-2 capitalize">
                    {plane.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Real Example */}
          <Card className="p-8 bg-gradient-to-r from-brand/5 to-brand-2/5 border-brand/20">
            <h3 className="text-2xl font-semibold text-foreground mb-4">Real Example</h3>
            <h4 className="text-lg font-semibold text-foreground mb-3">{era.realExample.title}</h4>
            <p className="text-foreground mb-4">{era.realExample.description}</p>
            <div className="p-4 bg-card/80 rounded-lg border border-border">
              <p className="text-foreground italic">{era.realExample.outcome}</p>
            </div>
          </Card>

          {/* What Carried Forward */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">What Carried Forward</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {era.whatCarriedForward.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center pt-8">
            <Link to="/governance">
              <Button className="btn-hero">
                Explore Governance & Safety Framework →
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default EraDetail;