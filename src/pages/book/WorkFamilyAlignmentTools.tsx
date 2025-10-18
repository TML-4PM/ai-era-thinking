import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Calculator, GitBranch, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const WorkFamilyAlignmentTools = () => {
  const tools = [
    {
      title: "Thinker Alignment",
      description: "Align your thought leaders and experts with WorkFamilyAI domains and agents",
      icon: GitBranch,
      path: "/explore",
      color: "text-blue-500"
    },
    {
      title: "Role Capability Assessment",
      description: "Assess organizational roles and map them to AI augmentation opportunities",
      icon: Calculator,
      path: "/calculators",
      color: "text-green-500"
    },
    {
      title: "Team Dynamics Optimizer",
      description: "Optimize work-family dynamics across your organizational teams",
      icon: Zap,
      path: "/explore",
      color: "text-purple-500"
    },
    {
      title: "Advanced Configuration",
      description: "Deep-dive configuration for custom WorkFamilyAI implementations",
      icon: Settings,
      path: "/books/workfamilyai/resources",
      color: "text-orange-500"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">WorkFamilyAI Alignment Tools</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Interactive tools and calculators to help you align your organization, teams, and thought 
          leaders with the WorkFamilyAI framework. Build custom executive teams and optimize work-family dynamics.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all hover:border-primary/50">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-muted ${tool.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link to={tool.path}>
                  <Button variant="outline" className="w-full group">
                    Open Tool
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/30 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>Get started with WorkFamilyAI alignment in 3 steps</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="font-medium text-foreground">Review Your Executive Team</p>
                <p>Explore the WorkFamilyAI agents organized by domain (Household, Organizational, Community)</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="font-medium text-foreground">Align Your Thinkers</p>
                <p>Use the Thinker Alignment tool to map your thought leaders to specific agents and domains</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="font-medium text-foreground">Optimize & Implement</p>
                <p>Use role assessment and team dynamics tools to implement AI augmentation across your organization</p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkFamilyAlignmentTools;
