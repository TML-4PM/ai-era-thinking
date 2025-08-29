
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userThinkerService } from "@/services/UserThinkerService";
import { UserThinker } from "@/types/UserThinker";

interface AddThinkerFormProps {
  onSuccess?: (thinker: UserThinker) => void;
}

const LOBE_OPTIONS = [
  "Perception/Patterning",
  "Decision/Action", 
  "Innovation/Strategy",
  "Ethics/Governance",
  "Culture/Behaviour"
];

export const AddThinkerForm: React.FC<AddThinkerFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Basic fields
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [lobe, setLobe] = useState("");
  const [coreIdea, setCoreIdea] = useState("");
  const [aiShift, setAiShift] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private" | "unlisted">("public");

  // Deep profile fields
  const [summary, setSummary] = useState("");
  const [keyConcepts, setKeyConcepts] = useState<string[]>([""]);
  const [whyItMatters, setWhyItMatters] = useState("");
  const [aiImplications, setAiImplications] = useState<string[]>([""]);
  const [recommendedPractices, setRecommendedPractices] = useState<string[]>([""]);
  const [commonPitfalls, setCommonPitfalls] = useState<string[]>([""]);
  const [successMetrics, setSuccessMetrics] = useState<string[]>([""]);

  // Usage fields
  const [usagePrompts, setUsagePrompts] = useState<string[]>([""]);
  const [practicalApplications, setPracticalApplications] = useState<string[]>([""]);
  const [relatedThinkers, setRelatedThinkers] = useState<string[]>([""]);

  // Cross-era relevance
  const [aiRelevance, setAiRelevance] = useState("");
  const [crossEraRelevance, setCrossEraRelevance] = useState("");
  const [phase1, setPhase1] = useState("");
  const [phase2, setPhase2] = useState("");
  const [phase3, setPhase3] = useState("");

  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, ""]);
  };

  const removeArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const updateArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter(prev => prev.map((item, i) => i === index ? value : item));
  };

  const filterEmpty = (arr: string[]) => arr.filter(item => item.trim() !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !area.trim() || !lobe || !coreIdea.trim() || !aiShift.trim()) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in name, area, lobe, core idea, and AI shift.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const thinkerData = {
        name: name.trim(),
        area: area.trim(),
        lobe,
        core_idea: coreIdea.trim(),
        ai_shift: aiShift.trim(),
        bio: bio.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
        visibility,
        approved: false,
        deep_profile: {
          summary: summary.trim() || undefined,
          keyConcepts: filterEmpty(keyConcepts),
          whyItMatters: whyItMatters.trim() || undefined,
          aiImplications: filterEmpty(aiImplications),
          recommendedPractices: filterEmpty(recommendedPractices),
          commonPitfalls: filterEmpty(commonPitfalls),
          successMetrics: filterEmpty(successMetrics),
        },
        usage_prompts: filterEmpty(usagePrompts),
        practical_applications: filterEmpty(practicalApplications),
        related_thinkers: filterEmpty(relatedThinkers),
        cross_era_relevance: {
          ai_relevance: aiRelevance.trim() || undefined,
          cross_era_relevance: crossEraRelevance.trim() || undefined,
          implementation_timeline: {
            phase_1: phase1.trim() || undefined,
            phase_2: phase2.trim() || undefined,
            phase_3: phase3.trim() || undefined,
          }
        }
      };

      const { data, error } = await userThinkerService.createThinker(thinkerData);

      if (error) throw error;

      toast({
        title: "Thinker Created!",
        description: `${name} has been added successfully.`,
      });

      if (data && onSuccess) {
        onSuccess(data);
      }

      // Reset form
      setName("");
      setArea("");
      setLobe("");
      setCoreIdea("");
      setAiShift("");
      setBio("");
      setImageUrl("");
      setSummary("");
      setKeyConcepts([""]);
      setWhyItMatters("");
      setAiImplications([""]);
      setRecommendedPractices([""]);
      setCommonPitfalls([""]);
      setSuccessMetrics([""]);
      setUsagePrompts([""]);
      setPracticalApplications([""]);
      setRelatedThinkers([""]);
      setAiRelevance("");
      setCrossEraRelevance("");
      setPhase1("");
      setPhase2("");
      setPhase3("");

    } catch (error) {
      console.error('Error creating thinker:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create thinker. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ArrayInput: React.FC<{
    label: string;
    values: string[];
    setter: React.Dispatch<React.SetStateAction<string[]>>;
    placeholder?: string;
  }> = ({ label, values, setter, placeholder = "Enter item..." }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {values.map((value, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => updateArrayItem(setter, index, e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          {values.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeArrayItem(setter, index)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addArrayItem(setter)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add {label.slice(0, -1)}
      </Button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Add Your Own Guru
        </h1>
        <p className="text-muted-foreground mt-2">
          Create a comprehensive profile for any thinker, philosopher, or mentor
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Daniel Kahneman"
                  required
                />
              </div>
              <div>
                <Label htmlFor="area">Area *</Label>
                <Input
                  id="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g., Behavioral Economics"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lobe">Cognitive Lobe *</Label>
                <Select value={lobe} onValueChange={setLobe} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a cognitive lobe" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOBE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="visibility">Visibility</Label>
                <Select value={visibility} onValueChange={setVisibility as any}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can see</SelectItem>
                    <SelectItem value="unlisted">Unlisted - Only with link</SelectItem>
                    <SelectItem value="private">Private - Only you</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="coreIdea">Core Idea *</Label>
              <Textarea
                id="coreIdea"
                value={coreIdea}
                onChange={(e) => setCoreIdea(e.target.value)}
                placeholder="e.g., Thinking, Fast and Slow"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                The main concept or theory they're known for
              </p>
            </div>

            <div>
              <Label htmlFor="aiShift">AI-Era Shift *</Label>
              <Textarea
                id="aiShift"
                value={aiShift}
                onChange={(e) => setAiShift(e.target.value)}
                placeholder="e.g., Fast/slow dichotomy breaks when AI operates in parallel at both speeds."
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                How their ideas change or become more relevant in the AI era
              </p>
            </div>

            <div>
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief biography or background..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">Profile Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>
          </CardContent>
        </Card>

        {/* Deep Profile Framework */}
        <Card>
          <CardHeader>
            <CardTitle>Deep Profile Framework</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="summary">Framework Summary</Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Overview of their framework and its core principles..."
                rows={3}
              />
            </div>

            <ArrayInput
              label="Key Concepts"
              values={keyConcepts}
              setter={setKeyConcepts}
              placeholder="Enter a key concept..."
            />

            <div>
              <Label htmlFor="whyItMatters">Why It Matters</Label>
              <Textarea
                id="whyItMatters"
                value={whyItMatters}
                onChange={(e) => setWhyItMatters(e.target.value)}
                placeholder="Explain why this framework is important and relevant..."
                rows={3}
              />
            </div>

            <ArrayInput
              label="AI Implications"
              values={aiImplications}
              setter={setAiImplications}
              placeholder="Enter an AI implication..."
            />

            <ArrayInput
              label="Recommended Practices"
              values={recommendedPractices}
              setter={setRecommendedPractices}
              placeholder="Enter a recommended practice..."
            />

            <ArrayInput
              label="Common Pitfalls"
              values={commonPitfalls}
              setter={setCommonPitfalls}
              placeholder="Enter a common pitfall..."
            />

            <ArrayInput
              label="Success Metrics"
              values={successMetrics}
              setter={setSuccessMetrics}
              placeholder="Enter a success metric..."
            />
          </CardContent>
        </Card>

        {/* Applications & Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Applications & Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ArrayInput
              label="Usage Prompts"
              values={usagePrompts}
              setter={setUsagePrompts}
              placeholder="Enter a usage prompt or example..."
            />

            <ArrayInput
              label="Practical Applications"
              values={practicalApplications}
              setter={setPracticalApplications}
              placeholder="Enter a practical application..."
            />

            <ArrayInput
              label="Related Thinkers"
              values={relatedThinkers}
              setter={setRelatedThinkers}
              placeholder="Enter name of related thinker..."
            />
          </CardContent>
        </Card>

        {/* Cross-Era Relevance */}
        <Card>
          <CardHeader>
            <CardTitle>Cross-Era Relevance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="aiRelevance">AI Relevance</Label>
              <Textarea
                id="aiRelevance"
                value={aiRelevance}
                onChange={(e) => setAiRelevance(e.target.value)}
                placeholder="How is this thinker specifically relevant to AI development and deployment?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="crossEraRelevance">Cross-Era Evolution</Label>
              <Textarea
                id="crossEraRelevance"
                value={crossEraRelevance}
                onChange={(e) => setCrossEraRelevance(e.target.value)}
                placeholder="How do their ideas evolve across different technological eras?"
                rows={3}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Implementation Timeline</h4>
              
              <div>
                <Label htmlFor="phase1">Phase 1 (0-6 months)</Label>
                <Textarea
                  id="phase1"
                  value={phase1}
                  onChange={(e) => setPhase1(e.target.value)}
                  placeholder="Short-term implementation steps..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="phase2">Phase 2 (6-18 months)</Label>
                <Textarea
                  id="phase2"
                  value={phase2}
                  onChange={(e) => setPhase2(e.target.value)}
                  placeholder="Medium-term implementation steps..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="phase3">Phase 3 (18+ months)</Label>
                <Textarea
                  id="phase3"
                  value={phase3}
                  onChange={(e) => setPhase3(e.target.value)}
                  placeholder="Long-term implementation steps..."
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            size="lg"
            className="px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Thinker...
              </>
            ) : (
              "Create Thinker"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
