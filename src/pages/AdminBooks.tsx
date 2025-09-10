import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, Book, ArrowLeft, Save, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import ChapterManager from "@/components/ChapterManager";
import { ImageSearchModal } from "@/components/ImageSearchModal";

interface BookFormProps {
  book?: any;
  onSave: () => void;
  onCancel: () => void;
}

const BookForm = ({ book, onSave, onCancel }: BookFormProps) => {
  const [title, setTitle] = useState(book?.title || '');
  const [subtitle, setSubtitle] = useState(book?.subtitle || '');
  const [leadDescription, setLeadDescription] = useState(book?.lead_description || '');
  const [seriesName, setSeriesName] = useState(book?.series_name || 'Tech for Humanity');
  const [status, setStatus] = useState(book?.status || 'draft');
  const [slug, setSlug] = useState(book?.slug || '');
  const [coverUrl, setCoverUrl] = useState(book?.cover_url || '');
  const [collection, setCollection] = useState(book?.collection || 'Tech for Humanity');
  const [owner, setOwner] = useState(book?.owner || '');
  const [dueDate, setDueDate] = useState(book?.due_date || '');
  const [draftUrl, setDraftUrl] = useState(book?.draft_url || '');
  const [readyFlag, setReadyFlag] = useState(book?.ready_flag || false);
  const [showImageSearch, setShowImageSearch] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Auto-generate slug from title
  useEffect(() => {
    if (!book && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setSlug(generatedSlug);
    }
  }, [title, book]);

  const saveBookMutation = useMutation({
    mutationFn: async () => {
      const bookData = {
        title,
        subtitle,
        lead_description: leadDescription,
        series_name: seriesName,
        status,
        slug,
        cover_url: coverUrl || null,
        collection,
        owner: owner || null,
        due_date: dueDate || null,
        draft_url: draftUrl || null,
        ready_flag: readyFlag
      };

      if (book) {
        const { error } = await supabase
          .from('books')
          .update(bookData)
          .eq('id', book.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('books')
          .insert(bookData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      toast({
        title: book ? "Book updated" : "Book created",
        description: `"${title}" has been ${book ? 'updated' : 'created'} successfully.`
      });
      onSave();
    },
    onError: (error: any) => {
      toast({
        title: `Error ${book ? 'updating' : 'creating'} book`,
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{book ? 'Edit Book' : 'Add New Book'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title..."
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Slug</label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="book-url-slug"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Subtitle</label>
          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter book subtitle..."
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Textarea
            value={leadDescription}
            onChange={(e) => setLeadDescription(e.target.value)}
            placeholder="Enter book description..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Series</label>
            <Input
              value={seriesName}
              onChange={(e) => setSeriesName(e.target.value)}
              placeholder="Series name"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Collection</label>
            <Select value={collection} onValueChange={setCollection}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Augmented Humanity (15)">Augmented Humanity (15)</SelectItem>
                <SelectItem value="Mini-Series (3)">Mini-Series (3)</SelectItem>
                <SelectItem value="Standalone">Standalone</SelectItem>
                <SelectItem value="Tech for Humanity">Tech for Humanity</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concept">Concept</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Owner</label>
            <Input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Book owner/author"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Due Date</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Ready Flag</label>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={readyFlag}
                onChange={(e) => setReadyFlag(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Ready for review</span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Draft URL</label>
          <Input
            value={draftUrl}
            onChange={(e) => setDraftUrl(e.target.value)}
            placeholder="URL to draft document (optional)"
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Cover Image</Label>
          <div className="flex gap-2">
            <Input
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="Cover image URL (optional)"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowImageSearch(true)}
            >
              Search Free Images
            </Button>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={() => saveBookMutation.mutate()}
            disabled={!title || !slug || saveBookMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {book ? 'Update' : 'Create'} Book
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>

        <ImageSearchModal
          open={showImageSearch}
          onOpenChange={setShowImageSearch}
          onImageSelected={(imageUrl, attribution) => {
            setCoverUrl(imageUrl);
            setShowImageSearch(false);
          }}
        />
      </CardContent>
    </Card>
  );
};

const AdminBooks = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBookForChapters, setSelectedBookForChapters] = useState<any>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const { data: books, isLoading } = useQuery({
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

  const deleteBook = useMutation({
    mutationFn: async (bookId: string) => {
      const { error } = await supabase
        .from("books")
        .delete()
        .eq("id", bookId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      toast({
        title: "Book deleted",
        description: "Book has been deleted successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting book",
        description: error.message,
        variant: "destructive"
      });
    }
  });

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
        <meta name="description" content="Content management system for books and chapters." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-6 py-6">
            <Link to="/">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Content Management System</h1>
                <p className="text-muted-foreground mt-2">Manage books and chapters for the Tech for Humanity series</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Book
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <Tabs defaultValue="books" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="chapters">Chapter Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="books" className="space-y-6">
              {showAddForm && (
                <BookForm
                  onSave={() => setShowAddForm(false)}
                  onCancel={() => setShowAddForm(false)}
                />
              )}

              {editingBook && (
                <BookForm
                  book={editingBook}
                  onSave={() => setEditingBook(null)}
                  onCancel={() => setEditingBook(null)}
                />
              )}

              {isLoading ? (
                <div className="grid gap-6">
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
                <div className="grid gap-6">
                  {books?.map((book) => (
                    <Card key={book.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">{book.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{book.subtitle}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link to={`/books/${book.slug}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedBookForChapters(book)}
                            >
                              <Book className="w-4 h-4 mr-2" />
                              Chapters
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingBook(book)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (confirm(`Delete "${book.title}"? This cannot be undone.`)) {
                                  deleteBook.mutate(book.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{book.lead_description}</p>
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          {book.collection && (
                            <div>
                              <span className="font-medium">Collection:</span>
                              <p className="text-muted-foreground">{book.collection}</p>
                            </div>
                          )}
                          {book.owner && (
                            <div>
                              <span className="font-medium">Owner:</span>
                              <p className="text-muted-foreground">{book.owner}</p>
                            </div>
                          )}
                          {book.due_date && (
                            <div>
                              <span className="font-medium">Due Date:</span>
                              <p className="text-muted-foreground">{new Date(book.due_date).toLocaleDateString()}</p>
                            </div>
                          )}
                          {book.draft_url && (
                            <div>
                              <span className="font-medium">Draft:</span>
                              <a 
                                href={book.draft_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-muted-foreground"
                              >
                                View Draft →
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="secondary">{book.series_name}</Badge>
                          <Badge variant={book.status === 'published' ? 'default' : 'outline'}>
                            {book.status?.replace('_', ' ') || 'Draft'}
                          </Badge>
                          <Badge variant="outline">
                            {book.book_chapters?.length || 0} chapters
                          </Badge>
                          {book.ready_flag && (
                            <Badge className="bg-green-500 text-white">
                              Ready
                            </Badge>
                          )}
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
            </TabsContent>
            
            <TabsContent value="chapters" className="space-y-6">
              {!selectedBookForChapters ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Select a Book to Manage Chapters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {books?.map((book) => (
                        <Button
                          key={book.id}
                          variant="outline"
                          onClick={() => setSelectedBookForChapters(book)}
                          className="justify-start"
                        >
                          <Book className="w-4 h-4 mr-2" />
                          {book.title}
                          <span className="ml-auto text-sm text-muted-foreground">
                            {book.book_chapters?.length || 0} chapters
                          </span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedBookForChapters.title}</h2>
                      <p className="text-muted-foreground">{selectedBookForChapters.subtitle}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedBookForChapters(null)}
                    >
                      Back to Book Selection
                    </Button>
                  </div>
                  
                  <ChapterManager
                    bookId={selectedBookForChapters.id}
                    chapters={selectedBookForChapters.book_chapters || []}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default AdminBooks;