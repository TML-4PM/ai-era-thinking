import { Lobe } from "./thinkers";

export interface ExpandedThinker {
  name: string;
  area: string;
  coreIdea: string;
  aiShift: string;
  lobe: Lobe;
  crossEraRelevance: {
    onPrem: string;
    cloudNative: string;
    genAI: string;
    agenticAI: string;
    bci: string;
  };
  usagePrompts: {
    question: string;
    context: string;
    application: string;
  }[];
  relatedThinkers: string[];
  practicalApplications: {
    immediate: string;
    mediumTerm: string;
    longTerm: string;
  };
}

export const EXPANDED_THINKERS: ExpandedThinker[] = [
  {
    name: "Daniel Kahneman",
    area: "Decision Science",
    coreIdea: "Thinking, Fast and Slow",
    aiShift: "Fast/slow dichotomy breaks when AI operates in parallel at both speeds.",
    lobe: "Decision/Action",
    crossEraRelevance: {
      onPrem: "System 2 thinking dominates - slow, deliberate processes in controlled environments",
      cloudNative: "System 1 emerges via automated dashboards and instant scaling decisions",
      genAI: "AI collapses the fast/slow distinction - parallel processing at human intuitive speed",
      agenticAI: "Agents embody both systems simultaneously, challenging human decision monopoly",
      bci: "Direct neural interface bypasses conscious deliberation entirely"
    },
    usagePrompts: [
      {
        question: "How does System 1/System 2 thinking apply to AI decision architecture?",
        context: "Designing decision flows in agentic systems",
        application: "Map which decisions need human System 2 override vs. AI System 1 automation"
      },
      {
        question: "What cognitive biases could AI agents inherit from training data?",
        context: "Bias auditing for deployed AI systems",
        application: "Build bias detection into agent decision logs and override triggers"
      }
    ],
    relatedThinkers: ["Amos Tversky", "Gerd Gigerenzer", "Herbert Simon"],
    practicalApplications: {
      immediate: "Audit current AI systems for inherited cognitive biases",
      mediumTerm: "Design dual-system AI architectures with fast/slow decision paths",
      longTerm: "Develop neurally-informed decision systems that bypass traditional cognitive limitations"
    }
  },
  {
    name: "Donella Meadows",
    area: "Systems Thinking",
    coreIdea: "Leverage points, system archetypes",
    aiShift: "Agentic AI dynamically alters leverage points.",
    lobe: "Innovation/Strategy",
    crossEraRelevance: {
      onPrem: "Fixed leverage points - change database schema, alter business process",
      cloudNative: "Dynamic scaling creates new leverage points in infrastructure",
      genAI: "Model updates can shift system behavior across all leverage points",
      agenticAI: "Agents identify and modify leverage points in real-time",
      bci: "Neural feedback creates unprecedented high-leverage intervention points"
    },
    usagePrompts: [
      {
        question: "Where are the leverage points in our AI transformation?",
        context: "Strategic planning for AI deployment",
        application: "Map the 12 leverage points against your current AI initiatives"
      },
      {
        question: "How do agents change the system they operate within?",
        context: "Designing self-modifying agent systems",
        application: "Build constraints that prevent agents from altering their own constraints"
      }
    ],
    relatedThinkers: ["Peter Senge", "Jay Forrester", "Geoffrey West"],
    practicalApplications: {
      immediate: "Map current leverage points in your organization using Meadows' hierarchy",
      mediumTerm: "Design AI systems that can identify but not alter high-leverage points",
      longTerm: "Create AI-human collaboration patterns that responsibly manage system evolution"
    }
  },
  {
    name: "Shoshana Zuboff",
    area: "Political Economy",
    coreIdea: "Surveillance capitalism",
    aiShift: "Agentic AI deepens surveillance-utility trade-off.",
    lobe: "Ethics/Governance",
    crossEraRelevance: {
      onPrem: "Data extraction limited by storage and processing constraints",
      cloudNative: "Cloud enables massive behavioral data aggregation",
      genAI: "Models learn behavioral patterns without explicit surveillance",
      agenticAI: "Agents actively extract behavioral surplus through interaction",
      bci: "Direct access to neural data eliminates privacy boundaries entirely"
    },
    usagePrompts: [
      {
        question: "How do we extract value without extracting behavioral surplus?",
        context: "Building ethical AI products",
        application: "Design value creation that benefits users without exploiting behavioral data"
      },
      {
        question: "What consent models work for agentic AI that learns continuously?",
        context: "Privacy-preserving agent design",
        application: "Implement dynamic consent systems that adapt to agent learning"
      }
    ],
    relatedThinkers: ["Yuval Noah Harari", "Hannah Arendt", "Elinor Ostrom"],
    practicalApplications: {
      immediate: "Audit your AI systems for surveillance capitalism patterns",
      mediumTerm: "Develop value models that don't depend on behavioral surplus extraction",
      longTerm: "Pioneer post-surveillance business models for neural interface era"
    }
  }
];

export function getExpandedThinker(name: string): ExpandedThinker | undefined {
  return EXPANDED_THINKERS.find(t => t.name === name);
}

export function getThinkersByLobe(lobe: Lobe): ExpandedThinker[] {
  return EXPANDED_THINKERS.filter(t => t.lobe === lobe);
}