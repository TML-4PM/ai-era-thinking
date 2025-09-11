import { Exemplar } from '@/types/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EraMapping } from './EraMapping';
import { Users, MessageCircle, BookOpen, User, Lightbulb } from 'lucide-react';

interface ExemplarDetailProps {
  exemplar: Exemplar;
  bookSlug: string;
}

const getStatusColor = (status?: string): string => {
  switch (status) {
    case 'complete': return 'bg-green-500 text-white';
    case 'seeded': return 'bg-blue-500 text-white';
    case 'scaffold': return 'bg-yellow-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export function ExemplarDetail({ exemplar, bookSlug }: ExemplarDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">{exemplar.name}</h1>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="outline">{exemplar.type}</Badge>
          {exemplar.status && (
            <Badge className={getStatusColor(exemplar.status)}>
              {exemplar.status}
            </Badge>
          )}
          {exemplar.progress && (
            <Badge variant="secondary">
              {exemplar.progress}% Complete
            </Badge>
          )}
        </div>
        {exemplar.notes && (
          <p className="text-muted-foreground max-w-3xl mx-auto">
            {exemplar.notes}
          </p>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <BookOpen className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="w-4 h-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="team-chat">
            <Users className="w-4 h-4 mr-2" />
            Team Chat
          </TabsTrigger>
          <TabsTrigger value="bio">
            <User className="w-4 h-4 mr-2" />
            Bio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Core Framework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AI transcends human dual-process limitations by operating simultaneously 
                  at both intuitive and analytical speeds, while potentially inheriting 
                  human biases from training data
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Author Statements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Original Insight</h4>
                    <p className="text-sm text-muted-foreground">
                      Thinking, Fast and Slow
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">AI-Era Shift</h4>
                    <p className="text-sm text-muted-foreground">
                      Fast/slow dichotomy breaks when AI operates in parallel at both speeds.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">AI Relevance</h4>
                    <p className="text-sm text-muted-foreground">
                      Critical for understanding cognitive biases in AI systems and designing human-AI collaboration
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <EraMapping eraMapping={exemplar.eraMapping} exemplarName={exemplar.name} />

          <Card>
            <CardHeader>
              <CardTitle>Implementation Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Phase 1 (0-6 months)</h4>
                  <p className="text-sm text-muted-foreground">
                    Audit AI systems for cognitive biases and implement detection systems
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Phase 2 (6-18 months)</h4>
                  <p className="text-sm text-muted-foreground">
                    Design hybrid architectures with System 1/2 pathways and human oversight
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Phase 3 (18+ months)</h4>
                  <p className="text-sm text-muted-foreground">
                    Develop post-cognitive AI that transcends human limitations while preserving agency
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {exemplar.relatedThinkers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Thinkers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {exemplar.relatedThinkers.map((thinker, index) => (
                    <Badge key={index} variant="outline">
                      {thinker}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Dream Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Dream team ready</p>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  View Team Members
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Chat with {exemplar.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Deep profile available for interactive conversations
              </p>
              <Button className="w-full">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team-chat">
          <Card>
            <CardHeader>
              <CardTitle>Team Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Collaborate with the full team of experts
              </p>
              <Button className="w-full">
                Join Team Discussion
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bio">
          <Card>
            <CardHeader>
              <CardTitle>Biography & Background</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed biographical information and professional background
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}