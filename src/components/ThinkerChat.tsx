import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Send, Bot, User, Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ExpandedThinker } from '@/data/expanded-thinkers';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ThinkerChatProps {
  thinker: ExpandedThinker;
}

const TOPICS = [
  'Agentic AI',
  'AI General',
  'Cloud Computing',
  'On-Prem Security/Legislation'
] as const;

export const ThinkerChat: React.FC<ThinkerChatProps> = ({ thinker }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm channeling ${thinker.name}'s perspective on ${thinker.area}. Their core insight is: "${thinker.coreIdea}". Ask me anything about how their thinking applies to modern technology challenges.`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [thinker]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('thinker-chat', {
        body: {
          thinkerName: thinker.name,
          thinkerArea: thinker.area,
          coreIdea: thinker.coreIdea,
          aiShift: thinker.aiShift,
          message: inputValue,
          topic: selectedTopic,
          conversationHistory: messages.slice(-6) // Last 6 messages for context
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Chat Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] space-y-4">
      {/* Topic Selection */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Focus Area (optional):</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedTopic === '' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTopic('')}
          >
            General
          </Button>
          {TOPICS.map(topic => (
            <Button
              key={topic}
              variant={selectedTopic === topic ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTopic(topic)}
            >
              {topic}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Messages */}
      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 px-4"
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-muted'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <Loader className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <Separator />

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Ask ${thinker.name} about ${selectedTopic || 'anything'}...`}
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {selectedTopic && (
        <Badge variant="secondary" className="self-start">
          Focused on: {selectedTopic}
        </Badge>
      )}
    </div>
  );
};