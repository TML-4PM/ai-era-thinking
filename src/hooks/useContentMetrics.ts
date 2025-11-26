import { useState, useEffect } from 'react';

interface ContentMetrics {
  overview: {
    total: number;
    linkedin: number;
    twitter: number;
    articles: number;
  };
  queue: {
    ready: number;
    in_progress: number;
  };
  topics: string[];
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  timestamp?: string;
}

const API_URL = 'https://obbmv7i5ryu6t64f4vupdjh55q0ftsef.lambda-url.ap-southeast-2.on.aws/';
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

export function useContentMetrics() {
  const [data, setData] = useState<ContentMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = async () => {
    try {
      setError(null);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      setData(json);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, lastUpdated, refetch: fetchMetrics };
}
