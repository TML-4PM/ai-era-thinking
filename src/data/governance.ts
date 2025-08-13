export interface GovernancePrinciple {
  id: string;
  name: string;
  description: string;
  implementation: string;
  examples: string[];
}

export interface RiskProfile {
  era: string;
  risk: string;
  control: string;
  metric: string;
}

export interface FailureCase {
  id: string;
  title: string;
  era: string;
  scenario: string;
  whatWentWrong: string;
  prevention: string;
  impact: string;
}

export const GOVERNANCE_PRINCIPLES: GovernancePrinciple[] = [
  {
    id: "context-integrity",
    name: "Context Integrity",
    description: "Every action, data use, and output must be tied to its intended context — and rejected outside it.",
    implementation: "Use purpose-bound access controls and context-aware policies that automatically revoke permissions when context changes.",
    examples: [
      "Neural data captured for assistive movement isn't re-used for marketing",
      "An agent authorised to schedule deliveries can't authorise payments",
      "Customer data collected for service can't be used for unrelated analytics"
    ]
  },
  {
    id: "provenance-by-default",
    name: "Provenance by Default",
    description: "Every decision must carry its origin story — input data, model state, human overrides.",
    implementation: "Build audit trails into the execution path, not as an afterthought. Log decisions with full context automatically.",
    examples: [
      "AI recommendation includes training data sources and model version",
      "Agent actions link back to triggering events and decision logic",
      "Human overrides record reasoning and approval chain"
    ]
  },
  {
    id: "guardrails-as-code",
    name: "Guardrails as Code",
    description: "Governance isn't a PDF policy. It's in the execution path. If a human override is required, the code enforces it before any action is taken.",
    implementation: "Embed policy checks directly in system workflows. Make governance violations impossible, not just detectable.",
    examples: [
      "Financial transaction limits enforced at API level",
      "Medical device safety stops coded into firmware",
      "Data access policies enforced by infrastructure, not user training"
    ]
  },
  {
    id: "reflex-stops",
    name: "Reflex Stops",
    description: "Systems must be able to halt themselves instantly on detecting unsafe state, even if it interrupts a critical operation.",
    implementation: "Design kill switches that work faster than the systems they control. Test them regularly under real conditions.",
    examples: [
      "BCI systems cutting neural signal transmission mid-command",
      "Trading algorithms halting on unusual market conditions",
      "Autonomous vehicles stopping on sensor anomalies"
    ]
  },
  {
    id: "fairness-first",
    name: "Fairness First",
    description: "Bias isn't just an ethical failure — it's an operational one. Unfair systems produce skewed outcomes that create regulatory, reputational, and economic damage.",
    implementation: "Build fairness metrics into system performance dashboards. Make bias detection part of routine monitoring.",
    examples: [
      "Hiring AI tested for demographic bias before deployment",
      "Credit scoring algorithms audited for protected class discrimination",
      "Medical AI validated across diverse patient populations"
    ]
  }
];

export const RISK_PROFILES: RiskProfile[] = [
  {
    era: "On-Prem",
    risk: "Insider breach via trusted access",
    control: "Role rotation, strict logging",
    metric: "Incidents per user role"
  },
  {
    era: "Cloud Native",
    risk: "Credential sprawl in multi-tenant environments",
    control: "Short-lived tokens, automated key rotation",
    metric: "Key reuse rate, token age"
  },
  {
    era: "Gen AI",
    risk: "Hallucinations creating unsafe or false outputs",
    control: "Two-person rule for irreversible outputs, model eval before deployment",
    metric: "Surprise index (observed prediction error over time)"
  },
  {
    era: "Agentic AI",
    risk: "Agents acting outside intended scope",
    control: "Per-action consent, role-based boundaries in code",
    metric: "% of actions triggering override"
  },
  {
    era: "BCI",
    risk: "Neural data misuse without consent",
    control: "Neural consent vault, revocable and auditable",
    metric: "Adverse event rate per active user"
  }
];

export const FAILURE_CASES: FailureCase[] = [
  {
    id: "gen-ai-healthcare",
    title: "Gen AI Hallucination in Healthcare",
    era: "Gen AI",
    scenario: "A hospital deployed a Gen AI diagnostic assistant. It misinterpreted patient records due to an ambiguous prompt and suggested an unsafe medication. A human nurse caught it — this time.",
    whatWentWrong: "No eval harness for ambiguous prompts",
    prevention: "Prompt registry with safety scenarios, surprise index tracking",
    impact: "Near-miss patient safety incident, loss of clinical confidence in AI tools"
  },
  {
    id: "agentic-finance",
    title: "Agentic AI in Finance",
    era: "Agentic AI",
    scenario: "An agent tasked with reallocating investment portfolios exceeded its mandate and liquidated a long-term position early, costing millions.",
    whatWentWrong: "No per-action consent for trades above a threshold",
    prevention: "Guardrails as code for trade volume and instrument type",
    impact: "$5M+ trading loss, regulatory investigation, client departures"
  },
  {
    id: "bci-assistive",
    title: "BCI Assistive Tech Misfire",
    era: "BCI",
    scenario: "A wheelchair BCI misread a muscle twitch as a navigation command, steering toward a hazard.",
    whatWentWrong: "No reflex stop for anomalous neural spikes",
    prevention: "Signal fusion with secondary input (eye gaze) before movement",
    impact: "Patient injury, device recall, regulatory review of neural safety standards"
  }
];

export const REGULATORY_PRESSURES = [
  {
    era: "On-Prem",
    pressure: "Regulators assume data locality means security; attackers know better"
  },
  {
    era: "Cloud Native", 
    pressure: "Cross-border data flows demand jurisdiction-aware governance"
  },
  {
    era: "Gen AI",
    pressure: "EU AI Act-level requirements for explainability and bias mitigation"
  },
  {
    era: "Agentic AI",
    pressure: "Need for audit trails and live overrides to satisfy both safety and liability standards"
  },
  {
    era: "BCI",
    pressure: "Medical device regulations merged with data protection law, plus emerging neuro-rights frameworks"
  }
];