
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import NotFound from "./pages/NotFound";
import EraDetail from "./pages/EraDetail";
import Governance from "./pages/Governance";
import Tools from "./pages/Tools";
import AdminExpand from "./pages/AdminExpand";
import AddThinker from "./pages/AddThinker";
import Favorites from "./pages/Favorites";
import Auth from "./pages/Auth";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import ChapterPage from "./pages/ChapterPage";
import AdminBooks from "./pages/AdminBooks";
import Thinkers from "./pages/Thinkers";
import Frameworks from "./pages/Frameworks";
import Chat from "./pages/Chat";
import WorkFamily from "./pages/WorkFamily";
import Calculators from "./pages/Calculators";
import Resources from "./pages/Resources";
import Workshops from "./pages/Workshops";
import CaseStudies from "./pages/CaseStudies";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import { FavoritesProvider } from "./context/FavoritesContext";
import BookLayout from "./components/BookLayout";
import BookOverview from "./pages/book/BookOverview";
import BookChapters from "./pages/book/BookChapters";
import BookLeadersLive from "./pages/book/BookLeadersLive";
import BookAddGuru from "./pages/book/BookAddGuru";
import BookResources from "./pages/book/BookResources";

// Create a stable QueryClient instance with proper configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/era/:eraId" element={<EraDetail />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/admin/expand" element={<AdminExpand />} />
              <Route path="/add-thinker" element={<AddThinker />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:slug" element={<BookLayout />}>
                <Route index element={<BookOverview />} />
                <Route path="chapters" element={<BookChapters />} />
                <Route path="leaders-live" element={<BookLeadersLive />} />
                <Route path="add-guru" element={<BookAddGuru />} />
                <Route path="resources" element={<BookResources />} />
              </Route>
              <Route path="/books/:slug/ch/:chapterOrder" element={<ChapterPage />} />
              <Route path="/admin/books" element={<AdminBooks />} />
              <Route path="/thinkers" element={<Thinkers />} />
              <Route path="/frameworks" element={<Frameworks />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/workfamily" element={<WorkFamily />} />
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/workshops" element={<Workshops />} />
              <Route path="/resources/case-studies" element={<CaseStudies />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
