import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

/**
 * Legacy redirect component for old /section-content/:sectionId routes
 * Redirects to the new /books/:bookSlug/sections/:sectionId format
 */
export default function SectionContentRedirect() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sectionId) {
      navigate("/books", { replace: true });
      return;
    }

    // Extract book slug from section ID
    // Section IDs are formatted like: "tech-for-humanity-ethics-consent"
    // The book slug is the prefix before the last segment
    const parts = sectionId.split("-");
    
    // Map common patterns
    let bookSlug = "";
    
    if (sectionId.startsWith("tech-for-humanity")) {
      bookSlug = "tech-for-humanity";
    } else if (sectionId.includes("thinking-engine")) {
      bookSlug = "thinking-engine";
    } else if (sectionId.includes("workfamilyai")) {
      bookSlug = "workfamilyai";
    } else if (sectionId.includes("quantum")) {
      bookSlug = "quantum-logic-systems";
    } else if (sectionId.includes("regenerative")) {
      bookSlug = "regenerative-organization";
    } else if (sectionId.includes("gcbat") || sectionId.includes("vignettes")) {
      bookSlug = "gcbat-vignettes";
  } else if (sectionId.includes("sovereign") || sectionId.includes("cage") || sectionId.includes("far-cage")) {
      bookSlug = "the-far-cage";
    } else {
      // Default: assume first 2-3 words are the book slug
      bookSlug = parts.slice(0, Math.min(3, parts.length - 1)).join("-");
    }

    // Redirect to proper route
    navigate(`/books/${bookSlug}/sections/${sectionId}`, { replace: true });
  }, [sectionId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
