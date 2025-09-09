import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";

const AdminBooks = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Check if user has admin role
  const { data: userRoles } = useQuery({
    queryKey: ["user-roles", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  useEffect(() => {
    if (userRoles) {
      const hasAdminRole = userRoles.some(role => role.role === 'admin');
      setIsAdmin(hasAdminRole);
      
      if (!hasAdminRole && user) {
        toast({
          title: "Access Denied",
          description: "You need admin privileges to access this page.",
          variant: "destructive",
        });
        navigate("/");
      }
    }
  }, [userRoles, user, navigate, toast]);

  const { data: books, isLoading, refetch } = useQuery({
    queryKey: ["admin-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          book_chapters(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin
  });

  const handleDelete = async (bookId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("books")
        .delete()
        .eq("id", bookId);

      if (error) throw error;

      toast({
        title: "Book deleted",
        description: `"${title}" has been deleted successfully.`,
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error deleting book",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {!user ? "Authentication Required" : "Access Denied"}
          </h1>
          <p className="text-muted-foreground mb-4">
            {!user 
              ? "Please sign in to access the admin panel." 
              : "You need admin privileges to access this page."
            }
          </p>
          <Link to={!user ? "/auth" : "/"}>
            <Button>{!user ? "Sign In" : "← Back to Home"}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin — Books Management</title>
        <meta name="description" content="Admin interface for managing books and chapters." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <Link to="/">
                  <Button variant="outline" size="sm" className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <h1 className="text-4xl font-bold text-foreground">Books Management</h1>
                <p className="text-muted-foreground mt-2">Manage books and chapters</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="mb-6">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add New Book
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded mb-4" />
                    <div className="flex gap-2">
                      <div className="h-8 bg-muted rounded w-20" />
                      <div className="h-8 bg-muted rounded w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {books?.map((book) => (
                <Card key={book.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{book.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{book.subtitle}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete(book.id, book.title)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground mb-4 line-clamp-2">
                      {book.lead_description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">{book.series_name}</Badge>
                      <Badge variant={book.status === 'published' ? 'default' : 'outline'}>
                        {book.status?.replace('_', ' ') || 'Draft'}
                      </Badge>
                      <Badge variant="outline">
                        {book.book_chapters?.length || 0} chapters
                      </Badge>
                    </div>

                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <Link to={`/books/${book.slug}`}>
                        <Button size="sm" variant="link" className="p-0 h-auto">
                          View Public Page →
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {books?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No books found. Create your first book to get started.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminBooks;