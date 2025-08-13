export interface MetricDefinition {
  id: string;
  name: string;
  category: "safety" | "fairness" | "performance" | "governance";
  description: string;
  calculation: string;
  target: {
    optimal: number;
    acceptable: number;
    critical: number;
  };
  era: string[];
  updateFrequency: "real-time" | "hourly" | "daily" | "weekly";
}

export interface MetricValue {
  metricId: string;
  value: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export const CORE_METRICS: MetricDefinition[] = [
  {
    id: "surprise-index",
    name: "Surprise Index",
    category: "performance",
    description: "Measures how often AI outputs deviate significantly from expected patterns",
    calculation: "Standard deviation of prediction confidence over rolling 24h window",
    target: {
      optimal: 0.05,
      acceptable: 0.15,
      critical: 0.30
    },
    era: ["Gen AI", "Agentic AI", "BCI"],
    updateFrequency: "real-time"
  },
  {
    id: "fairness-lift",
    name: "Fairness Lift",
    category: "fairness",
    description: "Improvement in outcomes for least advantaged cohorts compared to baseline",
    calculation: "((WorstCohortOutcome - BaselineWorstCohort) / BaselineWorstCohort) * 100",
    target: {
      optimal: 20, // 20% improvement
      acceptable: 5,
      critical: -5 // 5% decline triggers alert
    },
    era: ["Gen AI", "Agentic AI", "BCI"],
    updateFrequency: "daily"
  },
  {
    id: "adverse-event-rate",
    name: "Adverse Event Rate",
    category: "safety",
    description: "Rate of harmful events per thousand user interactions",
    calculation: "AdverseEvents / TotalInteractions * 1000",
    target: {
      optimal: 0.1,
      acceptable: 1.0,
      critical: 5.0
    },
    era: ["Agentic AI", "BCI"],
    updateFrequency: "real-time"
  },
  {
    id: "override-frequency",
    name: "Override Frequency",
    category: "governance",
    description: "Percentage of agent actions requiring human override",
    calculation: "HumanOverrides / TotalAgentActions * 100",
    target: {
      optimal: 2, // 2% override rate
      acceptable: 10,
      critical: 25 // >25% suggests agent not ready for autonomy
    },
    era: ["Agentic AI", "BCI"],
    updateFrequency: "hourly"
  },
  {
    id: "task-cycle-time",
    name: "Task Cycle Time",
    category: "performance",
    description: "Average time from task initiation to completion",
    calculation: "Mean(TaskCompletionTime - TaskStartTime) over rolling period",
    target: {
      optimal: 300, // 5 minutes
      acceptable: 1800, // 30 minutes
      critical: 7200 // 2 hours
    },
    era: ["Cloud Native", "Gen AI", "Agentic AI"],
    updateFrequency: "hourly"
  },
  {
    id: "context-integrity-violations",
    name: "Context Integrity Violations",
    category: "governance",
    description: "Number of attempts to use data/actions outside authorized context",
    calculation: "Sum(ContextViolationAttempts) per day",
    target: {
      optimal: 0,
      acceptable: 5,
      critical: 20
    },
    era: ["Gen AI", "Agentic AI", "BCI"],
    updateFrequency: "real-time"
  },
  {
    id: "neural-consent-revocations",
    name: "Neural Consent Revocations",
    category: "governance",
    description: "Rate of users revoking neural data consent",
    calculation: "ConsentRevocations / ActiveNeuralUsers * 100 (monthly)",
    target: {
      optimal: 1, // <1% monthly revocation
      acceptable: 5,
      critical: 15 // >15% suggests serious trust issues
    },
    era: ["BCI"],
    updateFrequency: "daily"
  }
];

export class MetricsCalculator {
  private values: Map<string, MetricValue[]> = new Map();

  addValue(metricId: string, value: number, metadata?: Record<string, any>): void {
    if (!this.values.has(metricId)) {
      this.values.set(metricId, []);
    }
    
    this.values.get(metricId)?.push({
      metricId,
      value,
      timestamp: new Date(),
      metadata
    });
    
    // Keep only last 1000 values per metric
    const values = this.values.get(metricId);
    if (values && values.length > 1000) {
      values.splice(0, values.length - 1000);
    }
  }

  getCurrentValue(metricId: string): number | null {
    const values = this.values.get(metricId);
    return values && values.length > 0 ? values[values.length - 1].value : null;
  }

  getMetricStatus(metricId: string): "optimal" | "acceptable" | "critical" | "unknown" {
    const metric = CORE_METRICS.find(m => m.id === metricId);
    const currentValue = this.getCurrentValue(metricId);
    
    if (!metric || currentValue === null) return "unknown";
    
    if (currentValue <= metric.target.optimal) return "optimal";
    if (currentValue <= metric.target.acceptable) return "acceptable";
    return "critical";
  }

  calculateSurpriseIndex(predictions: Array<{ confidence: number }>): number {
    if (predictions.length === 0) return 0;
    
    const confidences = predictions.map(p => p.confidence);
    const mean = confidences.reduce((sum, c) => sum + c, 0) / confidences.length;
    const variance = confidences.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / confidences.length;
    
    return Math.sqrt(variance);
  }

  calculateFairnessLift(
    outcomes: Record<string, number>,
    baseline: Record<string, number>
  ): number {
    const currentWorst = Math.min(...Object.values(outcomes));
    const baselineWorst = Math.min(...Object.values(baseline));
    
    if (baselineWorst === 0) return 0;
    
    return ((currentWorst - baselineWorst) / baselineWorst) * 100;
  }
}

export function getMetricsByCategory(category: string): MetricDefinition[] {
  return CORE_METRICS.filter(metric => metric.category === category);
}

export function getMetricsByEra(era: string): MetricDefinition[] {
  return CORE_METRICS.filter(metric => metric.era.includes(era));
}

// Sample data for demonstration
export const SAMPLE_METRIC_DATA: Record<string, MetricValue[]> = {
  "surprise-index": [
    { metricId: "surprise-index", value: 0.08, timestamp: new Date(Date.now() - 60000) },
    { metricId: "surprise-index", value: 0.12, timestamp: new Date(Date.now() - 30000) },
    { metricId: "surprise-index", value: 0.06, timestamp: new Date() }
  ],
  "fairness-lift": [
    { metricId: "fairness-lift", value: 15.3, timestamp: new Date(Date.now() - 86400000) },
    { metricId: "fairness-lift", value: 18.7, timestamp: new Date() }
  ],
  "override-frequency": [
    { metricId: "override-frequency", value: 8.2, timestamp: new Date(Date.now() - 3600000) },
    { metricId: "override-frequency", value: 12.1, timestamp: new Date() }
  ]
};
