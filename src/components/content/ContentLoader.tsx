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
        
        const url = `/books/content/${bookSlug}.json`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to load content for ${bookSlug}`);
        }
        
        // Check if response is JSON before trying to parse
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error(`ContentLoader: Expected JSON but got ${contentType} for ${url}`);
          throw new Error(`No structured content available for ${bookSlug}`);
        }
        
        const data: ContentModel = await response.json();
        setContent(data);
      } catch (err) {
        console.error('ContentLoader error:', err);
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