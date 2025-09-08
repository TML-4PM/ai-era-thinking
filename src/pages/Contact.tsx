import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact - Tech4Humanity Support & Inquiries</title>
        <meta name="description" content="Get in touch with Tech4Humanity for support, partnerships, or inquiries about AI transformation and governance consulting." />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/contact" />
        <meta property="og:title" content="Contact - Tech4Humanity Support & Inquiries" />
        <meta property="og:description" content="Get in touch with Tech4Humanity for support, partnerships, or consulting inquiries." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-thinker-flux.lovable.app/contact" />
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
                <Mail className="w-6 h-6 text-primary" />
                Contact Us
              </h1>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground">Get In Touch</h2>
              <p className="text-xl text-muted-foreground">
                Connect with us for support, partnerships, or AI transformation consulting
              </p>
            </div>
            
            <div className="p-8 bg-muted/20 rounded-lg text-center">
              <p className="text-muted-foreground">
                Contact information and inquiry forms coming soon. 
                For immediate inquiries, please check back or explore our resources in the meantime.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Contact;