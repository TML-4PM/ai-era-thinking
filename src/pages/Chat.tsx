import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";

const Chat = () => {
  return (
    <>
      <Helmet>
        <title>AI Chat - Tech4Humanity Interactive Discussions</title>
        <meta name="description" content="Engage in AI-powered discussions with thinkers, explore frameworks, and get personalized insights on transformation strategies." />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/chat" />
        <meta property="og:title" content="AI Chat - Tech4Humanity Interactive Discussions" />
        <meta property="og:description" content="Engage in AI-powered discussions with thinkers and explore transformation frameworks." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-thinker-flux.lovable.app/chat" />
        <meta property="og:image" content="https://ai-thinker-flux.lovable.app/og-share.jpg" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-primary" />
                AI Chat
              </h1>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Interactive AI Discussions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Engage with AI personas of influential thinkers and explore transformation strategies through interactive conversations.
            </p>
          </div>
          
          <div className="mt-12 p-8 bg-muted/20 rounded-lg text-center">
            <p className="text-muted-foreground">Coming soon - AI-powered chat interface for personalized discussions with thinker personas.</p>
          </div>
        </main>
      </div>
    </>
  );
};

export default Chat;