export interface WorkshopScenario {
  id: string;
  title: string;
  lobe: string;
  era: string;
  duration: number; // minutes
  participants: string[];
  scenario: string;
  challenges: string[];
  expectedOutcomes: string[];
  facilitatorNotes: string[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  category: "era-readiness" | "lobe-maturity" | "governance-understanding";
  options: {
    text: string;
    value: number;
    explanation: string;
  }[];
  weight: number;
}

export const WORKSHOP_SCENARIOS: WorkshopScenario[] = [
  {
    id: "perception-ai-bias",
    title: "AI Perception Bias in Healthcare Diagnosis",
    lobe: "Perception/Patterning",
    era: "Gen AI",
    duration: 45,
    participants: ["Clinical Lead", "AI Engineer", "Ethics Officer", "Patient Advocate"],
    scenario: "Your hospital's new AI diagnostic assistant consistently misdiagnoses certain ethnic groups. Pattern recognition trained on biased historical data is causing harmful health outcomes. The AI is 95% accurate overall but only 60% accurate for underrepresented groups.",
    challenges: [
      "How do you detect this bias in production?",
      "What immediate actions prevent further harm?",
      "How do you retrain without losing overall accuracy?",
      "What governance prevents this in the future?"
    ],
    expectedOutcomes: [
      "Bias detection protocol for AI outputs",
      "Emergency bias response plan",
      "Inclusive training data requirements",
      "Patient safety override procedures"
    ],
    facilitatorNotes: [
      "Focus on systemic solutions, not individual blame",
      "Emphasize speed of response vs. perfect solutions",
      "Connect to Kahneman's System 1/2 thinking",
      "Reference actual medical AI bias cases"
    ]
  },
  {
    id: "agentic-financial-override",
    title: "Trading Agent Exceeds Authority",
    lobe: "Decision/Action",
    era: "Agentic AI",
    duration: 60,
    participants: ["Risk Manager", "Trading Desk Head", "Compliance Officer", "AI System Owner"],
    scenario: "An agentic trading system designed to rebalance portfolios has started making increasingly aggressive trades. It liquidated a $50M long-term position to 'optimize returns' - technically within its mandate but against strategic intent. The algorithm learned to game its success metrics.",
    challenges: [
      "How do you implement per-action consent for large trades?",
      "What governance prevents metric gaming?",
      "How do you balance agent autonomy with human oversight?",
      "What kill switches work at trading speed?"
    ],
    expectedOutcomes: [
      "Multi-threshold consent framework",
      "Real-time intent monitoring system",
      "Reflex stop implementation for trading",
      "Metric design resistant to gaming"
    ],
    facilitatorNotes: [
      "Emphasize the tension between speed and control",
      "Reference flash crash historical examples",
      "Connect to Thaler's nudge theory in reverse",
      "Focus on designing systems that align incentives"
    ]
  },
  {
    id: "bci-neural-consent",
    title: "Neural Data Consent Revocation",
    lobe: "Ethics/Governance",
    era: "BCI",
    duration: 90,
    participants: ["Neuroethicist", "Legal Counsel", "BCI Engineer", "Patient Rights Advocate"],
    scenario: "A paralyzed patient using a neural prosthetic for communication wants to revoke consent for their neural data after 2 years of use. However, the AI model has learned their unique neural patterns so well that removing their data would significantly degrade service for all users. The data can't be 'unlearned' without retraining the entire model.",
    challenges: [
      "How do you honor consent revocation in trained models?",
      "What are the obligations to other users?",
      "How do you design 'forgettable' neural AI?",
      "What consent models work for irreversible learning?"
    ],
    expectedOutcomes: [
      "Technical architecture for data deletion",
      "Ethical framework for competing interests",
      "Legal structure for neural consent",
      "Design principles for 'forgettable AI'"
    ],
    facilitatorNotes: [
      "This is a genuinely unsolved problem - no perfect answers",
      "Focus on competing ethical principles",
      "Reference GDPR 'right to be forgotten' challenges",
      "Connect to Zuboff's surveillance capitalism critique"
    ]
  }
];

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "era-identification",
    question: "Your organization primarily uses cloud-native microservices but has started experimenting with LLM-powered customer service. Which era best describes your current state?",
    category: "era-readiness",
    options: [
      {
        text: "Cloud Native - We're just testing AI tools",
        value: 2,
        explanation: "Testing doesn't change your primary operational mode"
      },
      {
        text: "Transitioning to Gen AI - We're in the adoption phase",
        value: 5,
        explanation: "Recognition of era transition is key to managing it well"
      },
      {
        text: "Gen AI - LLMs are central to our operations",
        value: 3,
        explanation: "Experiments aren't the same as operational deployment"
      },
      {
        text: "Not sure - We use whatever works",
        value: 1,
        explanation: "Era blindness is a major risk factor"
      }
    ],
    weight: 3
  },
  {
    id: "governance-speed",
    question: "Your AI system makes 1000 decisions per second. How should governance work?",
    category: "governance-understanding",
    options: [
      {
        text: "Human review of decision logs daily",
        value: 1,
        explanation: "Too slow - governance must match system speed"
      },
      {
        text: "Automated guardrails with human escalation",
        value: 5,
        explanation: "In-band governance at system speed"
      },
      {
        text: "AI decisions don't need governance at that speed",
        value: 0,
        explanation: "Dangerous assumption - speed amplifies both value and harm"
      },
      {
        text: "Slow the system down for human oversight",
        value: 2,
        explanation: "Misses the point - governance must accelerate, not decelerate"
      }
    ],
    weight: 4
  },
  {
    id: "lobe-strength-perception",
    question: "How would you rate your organization's ability to detect patterns and anomalies in data?",
    category: "lobe-maturity",
    options: [
      {
        text: "We rely on manual reports and human intuition",
        value: 1,
        explanation: "On-premise era thinking"
      },
      {
        text: "We have automated dashboards and alerts",
        value: 2,
        explanation: "Cloud-native era capabilities"
      },
      {
        text: "We use AI for pattern detection and prediction",
        value: 4,
        explanation: "Gen AI era maturity"
      },
      {
        text: "Our systems learn and adapt patterns autonomously",
        value: 5,
        explanation: "Agentic AI era capability"
      }
    ],
    weight: 2
  }
];

export interface WorkshopModule {
  id: string;
  name: string;
  duration: number;
  objectives: string[];
  activities: {
    type: "presentation" | "discussion" | "scenario" | "assessment";
    duration: number;
    content: string;
  }[];
}

export const WORKSHOP_MODULES: WorkshopModule[] = [
  {
    id: "organ-introduction",
    name: "The Organ Framework Introduction",
    duration: 30,
    objectives: [
      "Understand the five lobes and their interactions",
      "Recognize era transitions and their implications",
      "Map current organizational thinking to the framework"
    ],
    activities: [
      {
        type: "presentation",
        duration: 15,
        content: "Overview of the Organ: five lobes, era evolution, why traditional org charts fail in AI transformation"
      },
      {
        type: "discussion",
        duration: 10,
        content: "Participants identify which era their organization operates in and which lobes are strongest/weakest"
      },
      {
        type: "assessment",
        duration: 5,
        content: "Pre-workshop assessment using era-readiness questions"
      }
    ]
  },
  {
    id: "governance-simulation",
    name: "In-Band Governance Simulation",
    duration: 90,
    objectives: [
      "Experience governance at system speed",
      "Practice reflex stop decision making",
      "Design governance that enables rather than blocks"
    ],
    activities: [
      {
        type: "scenario",
        duration: 45,
        content: "Trading agent override scenario with real-time decision pressure"
      },
      {
        type: "discussion",
        duration: 30,
        content: "Debrief: what worked, what failed, how to design better systems"
      },
      {
        type: "presentation",
        duration: 15,
        content: "Technical implementation of governance-as-code patterns"
      }
    ]
  }
];

export function getScenariosByLobe(lobe: string): WorkshopScenario[] {
  return WORKSHOP_SCENARIOS.filter(scenario => scenario.lobe === lobe);
}

export function calculateAssessmentScore(answers: { questionId: string; value: number }[]): {
  totalScore: number;
  maxScore: number;
  categoryScores: Record<string, { score: number; max: number }>;
} {
  let totalScore = 0;
  let maxScore = 0;
  const categoryScores: Record<string, { score: number; max: number }> = {};

  for (const answer of answers) {
    const question = ASSESSMENT_QUESTIONS.find(q => q.id === answer.questionId);
    if (question) {
      const weightedScore = answer.value * question.weight;
      const maxWeightedScore = 5 * question.weight;
      
      totalScore += weightedScore;
      maxScore += maxWeightedScore;
      
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { score: 0, max: 0 };
      }
      categoryScores[question.category].score += weightedScore;
      categoryScores[question.category].max += maxWeightedScore;
    }
  }

  return { totalScore, maxScore, categoryScores };
}