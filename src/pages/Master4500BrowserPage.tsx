import { Helmet } from 'react-helmet-async';
import { Master4500Browser } from '@/components/Master4500Browser';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Master4500BrowserPage() {
  return (
    <>
      <Helmet>
        <title>Master 4500 Browser — The Thinking Engine</title>
        <meta name="description" content="Browse and search all 4500+ exemplars from The Thinking Engine with advanced filters." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/books/thinking-engine/explorer">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Explorer
              </Button>
            </Link>
          </div>
          
          <Master4500Browser />
        </div>
      </div>
    </>
  );
}