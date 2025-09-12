import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Users } from "lucide-react";
import { AllThinkersGrid } from "@/components/AllThinkersGrid";

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
          
          <div className="mt-12 space-y-8">
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-6 border">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Chat with Thinkers</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Select any thinker below to start an AI-powered conversation. Each thinker has their own personality, expertise, and insights.
              </p>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Click on any thinker card → Open their modal → Go to "Chat" tab</span>
              </div>
            </div>
            
            <AllThinkersGrid />
          </div>
        </main>
      </div>
    </>
  );
};

export default Chat;