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
    area: "Behavioral Economics & Decision Science",
    coreIdea: "Dual-process theory: System 1 (fast, intuitive) vs System 2 (slow, deliberate) thinking shapes all human judgment under uncertainty",
    aiShift: "AI transcends human dual-process limitations by operating simultaneously at both intuitive and analytical speeds, while potentially inheriting human biases from training data",
    lobe: "Decision/Action",
    crossEraRelevance: {
      onPrem: "System 2 thinking dominates enterprise decision-making - careful analysis of controlled data sets, deliberate rule-based systems, slow but methodical processes in risk-averse environments",
      cloudNative: "System 1 emerges through real-time dashboards, automated scaling decisions, and instant feedback loops that mirror human intuitive pattern recognition at machine speed",
      genAI: "AI models collapse the fast/slow distinction by processing vast pattern recognition (System 1) and logical reasoning (System 2) simultaneously, creating new hybrid decision architectures",
      agenticAI: "Autonomous agents embody both systems in parallel - making thousands of micro-decisions intuitively while maintaining analytical oversight, fundamentally challenging human decision authority",
      bci: "Neural interfaces bypass conscious System 1/2 processing entirely, enabling direct thought-to-action pathways that eliminate traditional cognitive bottlenecks and biases"
    },
    usagePrompts: [
      {
        question: "How should we design AI decision architectures that leverage both System 1 and System 2 thinking?",
        context: "Building hybrid AI systems that balance speed and accuracy",
        application: "Create decision trees where routine choices use System 1 patterns, while high-stakes decisions trigger System 2 analytical processes with human oversight"
      },
      {
        question: "What cognitive biases are our AI systems inheriting from training data, and how do we detect them?",
        context: "Bias auditing for deployed AI systems across different domains",
        application: "Build bias detection dashboards that monitor for availability heuristic, anchoring bias, and confirmation bias in AI outputs with automated alerts"
      },
      {
        question: "How do we design 'nudge architectures' for AI agents interacting with humans?",
        context: "Creating AI systems that guide human decision-making ethically",
        application: "Implement choice architecture principles in AI interfaces that preserve human agency while optimizing outcomes through behavioral insights"
      },
      {
        question: "What happens to human judgment when AI handles most System 1 processing?",
        context: "Designing human-AI collaboration that preserves human decision-making skills",
        application: "Build AI systems with 'judgment preservation modes' that occasionally require human System 1 input to maintain cognitive capabilities"
      },
      {
        question: "How do we apply prospect theory to AI risk assessment and resource allocation?",
        context: "Building AI systems that understand human risk perception and loss aversion",
        application: "Design AI recommendation systems that account for human loss aversion by framing choices in terms of gains rather than losses"
      },
      {
        question: "What decision-making processes should remain exclusively human in an AI-dominant world?",
        context: "Defining the boundaries between human and AI decision authority",
        application: "Create decision classification frameworks that reserve high-uncertainty, value-laden, and irreversible choices for human System 2 processing"
      }
    ],
    relatedThinkers: ["Amos Tversky", "Gerd Gigerenzer", "Herbert Simon", "Dan Ariely", "Richard Thaler", "Nassim Nicholas Taleb"],
    practicalApplications: {
      immediate: "Audit existing AI systems for inherited cognitive biases using behavioral economics frameworks, implement bias detection alerts, and create decision classification systems",
      mediumTerm: "Design hybrid AI architectures with explicit System 1/System 2 pathways, build nudge-based human-AI interfaces, and develop AI systems that preserve human judgment skills",
      longTerm: "Create post-cognitive AI systems that transcend human decision-making limitations while preserving human agency in value-critical choices"
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