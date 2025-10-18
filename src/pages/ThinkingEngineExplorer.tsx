import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBookProgress } from '@/hooks/useThinkingEngineProgress';
import { ThinkingEngineNavigator } from '@/components/ThinkingEngineNavigator';
import { Brain, GitBranch, Calendar, Grid3x3, ArrowRight, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ThinkingEngineExplorer() {
  const { data: stats, isLoading } = useBookProgress();

  return (
    <>
      <Helmet>
        <title>The Thinking Engine Explorer — Tech4Humanity</title>
        <meta name="description" content="Explore 15 chapters and 4500+ exemplars showing how humans and machines think, decide, and evolve together across five technological eras." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-800 dark:to-indigo-900 text-white">
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
          <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center space-y-6">
              <Badge className="bg-white/20 text-white border-white/30">
                15 Chapters • 4500+ Exemplars • 5 Eras
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                The Thinking Engine
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
                Cognitive Systems, Decision-Making, and Intelligent Design
              </p>
              <p className="text-lg text-purple-200 max-w-2xl mx-auto">
                Explore how humans and machines think, decide, and evolve together across five technological eras.
              </p>

              {/* Stats Bar */}
              {!isLoading && stats && (
                <div className="flex flex-wrap justify-center gap-6 pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <div className="text-sm text-purple-200">Total Exemplars</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{stats.complete}</div>
                    <div className="text-sm text-purple-200">Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{stats.avgProgress}%</div>
                    <div className="text-sm text-purple-200">Avg Progress</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Modes */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Link to="/books/thinking-engine/chapters">
              <Card className="hover:shadow-xl transition-all h-full group">
                <CardHeader>
                  <Grid3x3 className="w-12 h-12 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
                  <CardTitle>Chapter View</CardTitle>
                  <CardDescription>
                    Browse all 15 chapters from Principles to Unstructured
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="group-hover:translate-x-2 transition-transform">
                    Explore Chapters <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/books/thinking-engine/era-evolution">
              <Card className="hover:shadow-xl transition-all h-full group">
                <CardHeader>
                  <Calendar className="w-12 h-12 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                  <CardTitle>Era View</CardTitle>
                  <CardDescription>
                    See how concepts evolve across 5 technological eras
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="group-hover:translate-x-2 transition-transform">
                    View Timeline <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/books/thinking-engine/master4500">
              <Card className="hover:shadow-xl transition-all h-full group">
                <CardHeader>
                  <Brain className="w-12 h-12 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
                  <CardTitle>Master 4500</CardTitle>
                  <CardDescription>
                    Browse and search all exemplars with advanced filters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="group-hover:translate-x-2 transition-transform">
                    Browse All <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Chapter Navigator */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Interactive Chapter Explorer
              </CardTitle>
              <CardDescription>
                Filter by era and explore how each chapter contributes to AI evolution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThinkingEngineNavigator />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}