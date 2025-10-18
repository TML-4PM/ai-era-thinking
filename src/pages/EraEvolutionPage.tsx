import { Helmet } from 'react-helmet-async';
import { EraEvolutionView } from '@/components/EraEvolutionView';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EraEvolutionPage() {
  return (
    <>
      <Helmet>
        <title>Era Evolution — The Thinking Engine</title>
        <meta name="description" content="See how concepts evolve across five technological eras in The Thinking Engine." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/books/thinking-engine/explorer">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Explorer
              </Button>
            </Link>
          </div>
          
          <EraEvolutionView />
        </div>
      </div>
    </>
  );
}