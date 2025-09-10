import { useState, useEffect } from 'react';
import { ContentModel } from '@/types/content';

interface ContentLoaderProps {
  bookSlug: string;
  children: (data: { content: ContentModel | null; loading: boolean; error: string | null }) => React.ReactNode;
}

export function ContentLoader({ bookSlug, children }: ContentLoaderProps) {
  const [content, setContent] = useState<ContentModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/books/content/${bookSlug}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load content for ${bookSlug}`);
        }
        
        const data: ContentModel = await response.json();
        setContent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [bookSlug]);

  return <>{children({ content, loading, error })}</>;
}