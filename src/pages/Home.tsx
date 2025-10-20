import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useBooks } from "@/hooks/useBooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  BookOpen, 
  Compass, 
  Users, 
  Settings, 
  Heart, 
  Plus,
  Lightbulb,
  Target,
  Zap
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { data: books } = useBooks();

  const featuredBooks = books?.slice(0, 3) || [];

  return (
    <>
      <Helmet>
        <title>Tech4Humanity — Leaders Live Forever</title>
        <meta name="description" content="Explore how AI thinkers' frameworks evolve across domains. Access our book series, add your own gurus, and engage with governance tools." />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/" />
        <meta property="og:title" content="Tech4Humanity — Leaders Live Forever" />
        <meta property="og:description" content="Explore how AI thinkers' frameworks evolve across domains. Access our book series, add your own gurus, and engage with governance tools." />
        <meta property="og:url" content="https://ai-thinker-flux.lovable.app/" />
        <meta property="og:image" content="https://ai-thinker-flux.lovable.app/og-share.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tech4Humanity — Leaders Live Forever" />
        <meta name="twitter:description" content="Explore how AI thinkers' frameworks evolve across domains. Access our book series, add your own gurus, and engage with governance tools." />
        <meta name="twitter:image" content="https://ai-thinker-flux.lovable.app/og-share.jpg" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        {/* Navigation Header */}
        <div className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/T4H%20Logo%201.jpg" 
                    alt="Tech4Humanity logo" 
                    className="h-12 w-12 rounded-lg object-contain" 
                  />
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Tech4Humanity
                  </span>
                </div>
                
                <nav className="hidden md:flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/books")}
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Books
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/explore")}
                    className="flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4" />
                    Explore Thinkers
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/resources")}
                    className="flex items-center gap-2"
                  >
                    <Target className="w-4 h-4" />
                    Resources
                  </Button>
                </nav>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Leaders Live Forever
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Explore how our favourite thinkers' frameworks evolve and apply across different domains and contexts. 
              Access our comprehensive book series and contribute your own insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate("/books")}
                className="gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Explore Book Series
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/explore")}
                className="gap-2"
              >
                <Compass className="w-5 h-5" />
                Discover Thinkers
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Books */}
        <section className="py-16 bg-white/30 dark:bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Books</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive guides for human-centered technology and AI integration
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {featuredBooks.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/books/${book.slug}`)}>
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    {book.cover ? (
                      <img 
                        src={book.cover} 
                        alt={`${book.title} cover`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="text-center p-4">
                        <BookOpen className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                        <div className="text-lg font-bold">{book.title}</div>
                        <div className="text-sm opacity-60">{book.subtitle}</div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{book.lead_description}</p>
                    <Badge variant="secondary">{book.series_name}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" onClick={() => navigate("/books")}>
                View All Books →
              </Button>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools for understanding and applying AI thinker frameworks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/explore")}>
                <CardHeader className="pb-4">
                  <Compass className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-xl">Explore Thinkers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Interactive maps and timelines of AI thought leaders across different eras and domains
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/add-thinker")}>
                <CardHeader className="pb-4">
                  <Plus className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-xl">Add Your Guru</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Contribute your own thinkers and discuss their frameworks with the community
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/favorites")}>
                <CardHeader className="pb-4">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-xl">Community Picks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Discover crowd-sourced thinkers and frameworks from our community
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/governance")}>
                <CardHeader className="pb-4">
                  <Settings className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-xl">Governance Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Advanced governance frameworks and tools for organizational transformation
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Join the Community</h2>
            <p className="text-xl mb-8 opacity-90">
              Start exploring thinkers, add your own insights, and contribute to the evolving landscape of AI thought leadership
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                variant="secondary"
                onClick={() => navigate("/add-thinker")}
                className="gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your Own Guru
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/explore")}
                className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Zap className="w-5 h-5" />
                Start Exploring
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;