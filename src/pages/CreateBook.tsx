import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookWizard } from "@/components/book-wizard/BookWizard";
import { Plus, BookOpen, Users, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBooks } from "@/hooks/useBooks";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateBook() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const navigate = useNavigate();
  const { data: allBooks } = useBooks();

  // Fetch user's books
  const { data: userBooks, isLoading } = useQuery({
    queryKey: ['user-books'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const stats = {
    total: userBooks?.length || 0,
    inProgress: userBooks?.filter(b => b.status === 'in_progress').length || 0,
    published: userBooks?.filter(b => b.status === 'published').length || 0,
  };

  return (
    <div className="container max-w-6xl py-12">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Create Your Book</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from professionally designed templates and start building your book in minutes
          </p>
          <Button size="lg" onClick={() => setWizardOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Create New Book
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.published}</div>
            </CardContent>
          </Card>
        </div>

        {/* My Books Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Books</h2>
            <Button variant="outline" onClick={() => navigate('/books')}>
              View All Books
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : userBooks && userBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userBooks.slice(0, 6).map(book => (
                <Card 
                  key={book.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/books/${book.slug}`)}
                >
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {book.subtitle || book.series_name || 'No subtitle'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {book.lead_description}
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                        {book.status}
                      </span>
                      {book.ready_flag && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground">
                          Ready
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No books yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start creating your first book using our templates
                </p>
                <Button onClick={() => setWizardOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Book
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Creating your book is easy with our guided wizard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { step: 1, title: 'Choose Template', desc: 'Select from 6 professional templates' },
                { step: 2, title: 'Add Details', desc: 'Enter your book title and description' },
                { step: 3, title: 'Structure Chapters', desc: 'Customize or use suggested chapters' },
                { step: 4, title: 'Set Publishing', desc: 'Configure visibility and status' },
                { step: 5, title: 'Start Writing', desc: 'Begin adding content immediately' },
              ].map(item => (
                <div key={item.step} className="text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold">
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <BookWizard 
        open={wizardOpen} 
        onOpenChange={setWizardOpen}
        onSuccess={(bookId) => {
          setWizardOpen(false);
          // Navigate to the new book after a brief delay
          setTimeout(() => {
            const newBook = allBooks?.find(b => b.id === bookId);
            if (newBook) {
              navigate(`/books/${newBook.slug}`);
            }
          }, 100);
        }}
      />
    </div>
  );
}
