import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <main id="main" className="min-h-screen flex items-center justify-center bg-background">
      <Helmet>
        <title>404 - Page Not Found | The Organ Framework</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/404" />
      </Helmet>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
        <a href="/" className="underline text-primary hover:opacity-80">
          Return to Home
        </a>
      </div>
    </main>
  );
};

export default NotFound;
