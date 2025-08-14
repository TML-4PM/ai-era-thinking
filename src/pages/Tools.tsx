import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Code, Users, BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { GOVERNANCE_TOOLS, getToolsByCategory } from "@/data/governance-tools";
import { WORKSHOP_SCENARIOS, ASSESSMENT_QUESTIONS } from "@/data/workshop-materials";
import MetricsDashboard from "@/components/MetricsDashboard";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

export default function Tools() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Implementation Tools - The Organ Framework</title>
        <meta name="description" content="Practical tools for implementing The Organ framework: governance code, workshop materials, and metrics dashboards." />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/tools" />
        <meta property="og:title" content="Implementation Tools - The Organ" />
        <meta property="og:description" content="Practical tools for implementing The Organ framework." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-thinker-flux.lovable.app/tools" />
        <meta property="og:image" content="https://ai-thinker-flux.lovable.app/og-share.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Implementation Tools - The Organ" />
        <meta name="twitter:description" content="Practical tools for implementing The Organ framework." />
        <meta name="twitter:image" content="https://ai-thinker-flux.lovable.app/og-share.jpg" />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Organ Map
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Implementation Tools</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From theory to deployment: practical tools for building The Organ into your organization
          </p>
        </div>

        <Tabs defaultValue="governance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="governance" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Policy as Code
            </TabsTrigger>
            <TabsTrigger value="workshops" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Workshop Tools
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Live Metrics
            </TabsTrigger>
            <TabsTrigger value="downloads" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Downloads
            </TabsTrigger>
          </TabsList>

          <TabsContent value="governance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getToolsByCategory("policy-as-code").map((tool) => (
                <Card key={tool.id} className="framework-card cursor-pointer" onClick={() => setSelectedTool(tool.id)}>
                  <CardHeader>
                    <CardTitle>{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Applicable Eras:</div>
                      <div className="flex flex-wrap gap-1">
                        {tool.eraApplicability.map(era => (
                          <span key={era} className="px-2 py-1 bg-accent/20 rounded text-xs">{era}</span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workshops" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {WORKSHOP_SCENARIOS.slice(0, 4).map((scenario) => (
                <Card key={scenario.id} className="framework-card">
                  <CardHeader>
                    <CardTitle>{scenario.title}</CardTitle>
                    <CardDescription>
                      {scenario.lobe} • {scenario.era} • {scenario.duration} min
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{scenario.scenario.substring(0, 150)}...</p>
                    <div className="text-xs text-muted-foreground">
                      Participants: {scenario.participants.join(", ")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics">
            <MetricsDashboard />
          </TabsContent>

          <TabsContent value="downloads" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="framework-card">
                <CardHeader>
                  <CardTitle>Executive Brief</CardTitle>
                  <CardDescription>6-page board presentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="framework-card">
                <CardHeader>
                  <CardTitle>Workshop Toolkit</CardTitle>
                  <CardDescription>Complete facilitation package</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Download ZIP
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="framework-card">
                <CardHeader>
                  <CardTitle>Code Templates</CardTitle>
                  <CardDescription>Governance implementation</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    View GitHub
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}