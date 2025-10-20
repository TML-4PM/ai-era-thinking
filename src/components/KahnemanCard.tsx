import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface KahnemanData {
  name: string;
  domain: string;
  focus: string;
  blurb: string;
  buttons?: Array<{ label: string; href: string }>;
  tabs: Array<{
    title: string;
    sections: Array<{ heading: string; body: string }>;
  }>;
}

export const KahnemanCard = () => {
  const { data, isLoading, error } = useQuery<KahnemanData>({
    queryKey: ['kahneman-data'],
    queryFn: async () => {
      const response = await fetch('/data/kahneman.json');
      if (!response.ok) throw new Error('Failed to load data');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-8 bg-muted rounded w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="h-24 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{data.name}</CardTitle>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span className="font-medium">{data.domain}</span>
          <span>•</span>
          <span>{data.focus}</span>
          <span>•</span>
          <span className="italic">{data.blurb}</span>
        </div>
      </CardHeader>
      <CardContent>
        {data.buttons && data.buttons.length > 0 && (
          <div className="flex gap-2 mb-6">
            {data.buttons.map((button, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                asChild
              >
                <a href={button.href} target="_blank" rel="noopener noreferrer">
                  {button.label}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>
        )}

        <Tabs defaultValue={data.tabs[0]?.title || "overview"} className="w-full">
          <TabsList className="w-full justify-start">
            {data.tabs.map((tab, idx) => (
              <TabsTrigger key={idx} value={tab.title}>
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {data.tabs.map((tab, idx) => (
            <TabsContent key={idx} value={tab.title} className="space-y-4">
              {tab.sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-2">
                  <h4 className="font-semibold text-sm text-foreground">
                    {section.heading}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {section.body}
                  </p>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
