import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Share2, ExternalLink, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Cards = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast({
        title: "Copied!",
        description: `${type} URL copied to clipboard`,
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const kahnemanUrl = `${window.location.origin}/cards/kahneman.html`;
  const kahnemanInlineUrl = `${window.location.origin}/cards/kahneman-inline.html`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Shareable Thinker Cards - Thinking Engine</title>
        <meta name="description" content="Generate and share standalone thinker profile cards. Perfect for social media, presentations, and educational content." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Shareable Thinker Cards</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Generate standalone, shareable URLs for individual thinker profiles. Perfect for social media, presentations, and educational content.
            </p>
          </div>
        </header>

        <main className="space-y-8">
          {/* Available Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Available Cards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Daniel Kahneman Card */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Daniel Kahneman</h3>
                    <p className="text-sm text-muted-foreground">Decision Science · Thinking Fast and Slow</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(kahnemanUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Standard Version (loads data externally)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input 
                        value={kahnemanUrl} 
                        readOnly 
                        className="text-sm"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopy(kahnemanUrl, 'Standard')}
                      >
                        {copied === 'Standard' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Inline Version (fully self-contained)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input 
                        value={kahnemanInlineUrl} 
                        readOnly 
                        className="text-sm"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopy(kahnemanInlineUrl, 'Inline')}
                      >
                        {copied === 'Inline' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Standard Version</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Loads data from external JSON file</li>
                    <li>• Smaller file size</li>
                    <li>• Requires server access to data files</li>
                    <li>• Best for embedding in websites</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Inline Version</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Self-contained with embedded data</li>
                    <li>• Works offline once loaded</li>
                    <li>• No external dependencies</li>
                    <li>• Perfect for sharing via email or USB</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Social Sharing Features</h4>
                <p className="text-sm text-muted-foreground">
                  Both cards include Open Graph and Twitter Card meta tags for rich social media previews when shared on platforms like LinkedIn, Twitter, or Facebook.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Cards;