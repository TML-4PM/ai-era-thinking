export interface GovernanceTool {
  id: string;
  name: string;
  category: "policy-as-code" | "safety-harness" | "consent-vault" | "metrics";
  description: string;
  codeTemplate: string;
  usageExample: string;
  eraApplicability: string[];
  risksMitigated: string[];
}

export const GOVERNANCE_TOOLS: GovernanceTool[] = [
  {
    id: "context-integrity",
    name: "Context Integrity Enforcement",
    category: "policy-as-code",
    description: "Ensures every action, data use, and output remains within its intended context",
    codeTemplate: `
class ContextIntegrityGuard {
  private contextRules: Map<string, ContextRule[]> = new Map();
  
  validateAction(action: AgentAction, context: Context): boolean {
    const rules = this.contextRules.get(action.type) || [];
    return rules.every(rule => rule.validate(action, context));
  }
  
  enforceContext(action: AgentAction, originalContext: Context): void {
    if (!this.validateAction(action, originalContext)) {
      throw new ContextViolationError(
        \`Action \${action.type} violated context \${originalContext.id}\`
      );
    }
  }
}

interface ContextRule {
  validate(action: AgentAction, context: Context): boolean;
}

class DataUseContextRule implements ContextRule {
  validate(action: AgentAction, context: Context): boolean {
    // Ensure data captured for assistive movement isn't used for marketing
    if (action.type === 'data-use' && action.dataType === 'neural-movement') {
      return context.purpose === 'assistive-technology';
    }
    return true;
  }
}
    `,
    usageExample: `
// In BCI assistive device
const guard = new ContextIntegrityGuard();
guard.addRule('neural-data-use', new DataUseContextRule());

// Before any neural data processing
try {
  guard.enforceContext(neuralProcessingAction, assistiveContext);
  processNeuralData(data);
} catch (ContextViolationError) {
  logViolation();
  haltProcessing();
}
    `,
    eraApplicability: ["Gen AI", "Agentic AI", "BCI"],
    risksMitigated: ["Data misuse", "Scope creep", "Unauthorized access"]
  },
  {
    id: "per-action-consent",
    name: "Per-Action Consent Module",
    category: "policy-as-code",
    description: "Enforces consent requirements for each agent action before execution",
    codeTemplate: `
interface ConsentToken {
  actionType: string;
  maxValue?: number;
  timeWindow?: number;
  context: string;
  issuedAt: Date;
  expiresAt?: Date;
}

class PerActionConsent {
  private consentStore: Map<string, ConsentToken[]> = new Map();
  
  async requestConsent(
    userId: string, 
    action: AgentAction
  ): Promise<ConsentToken | null> {
    // Check if action requires human consent
    if (this.requiresConsent(action)) {
      return await this.promptUserConsent(userId, action);
    }
    return this.generateAutoConsent(action);
  }
  
  validateConsent(action: AgentAction, token: ConsentToken): boolean {
    if (token.expiresAt && new Date() > token.expiresAt) return false;
    if (token.maxValue && action.value > token.maxValue) return false;
    return token.actionType === action.type;
  }
  
  private requiresConsent(action: AgentAction): boolean {
    // Financial trades above threshold, irreversible actions, etc.
    return action.type === 'financial-trade' && action.value > 10000;
  }
}
    `,
    usageExample: `
// In agentic trading system
const consent = new PerActionConsent();

async function executeTradeAction(tradeAction: TradeAction) {
  const consentToken = await consent.requestConsent(userId, tradeAction);
  
  if (!consentToken || !consent.validateConsent(tradeAction, consentToken)) {
    throw new ConsentRequiredError('Trade requires explicit consent');
  }
  
  executeTrade(tradeAction);
}
    `,
    eraApplicability: ["Agentic AI", "BCI"],
    risksMitigated: ["Unauthorized actions", "Scope violations", "Financial risk"]
  },
  {
    id: "reflex-stop",
    name: "Reflex Stop System",
    category: "safety-harness",
    description: "Instantly halts systems on detecting unsafe states, even during critical operations",
    codeTemplate: `
interface SafetyCheck {
  name: string;
  evaluate(systemState: SystemState): SafetyViolation | null;
  criticalityLevel: 'warning' | 'error' | 'critical';
}

class ReflexStopSystem {
  private checks: SafetyCheck[] = [];
  private emergencyStopCallbacks: (() => void)[] = [];
  
  addSafetyCheck(check: SafetyCheck): void {
    this.checks.push(check);
  }
  
  addEmergencyStopCallback(callback: () => void): void {
    this.emergencyStopCallbacks.push(callback);
  }
  
  evaluateAndAct(systemState: SystemState): void {
    for (const check of this.checks) {
      const violation = check.evaluate(systemState);
      if (violation) {
        this.handleViolation(violation, check.criticalityLevel);
      }
    }
  }
  
  private handleViolation(
    violation: SafetyViolation, 
    level: 'warning' | 'error' | 'critical'
  ): void {
    if (level === 'critical') {
      this.emergencyStopCallbacks.forEach(callback => callback());
      throw new EmergencyStopError(violation.message);
    }
  }
}

// BCI-specific safety check
class NeuralSpikeAnomalyCheck implements SafetyCheck {
  name = 'neural-spike-anomaly';
  criticalityLevel = 'critical' as const;
  
  evaluate(state: SystemState): SafetyViolation | null {
    if (state.neuralSpike && state.neuralSpike.amplitude > state.baseline * 3) {
      return {
        message: 'Anomalous neural spike detected',
        severity: 'critical',
        affectedSystems: ['movement-control']
      };
    }
    return null;
  }
}
    `,
    usageExample: `
// In BCI wheelchair control system
const reflexStop = new ReflexStopSystem();
reflexStop.addSafetyCheck(new NeuralSpikeAnomalyCheck());
reflexStop.addEmergencyStopCallback(() => wheelchair.immediateStop());

// In main control loop
setInterval(() => {
  const currentState = wheelchair.getSystemState();
  reflexStop.evaluateAndAct(currentState);
}, 10); // 10ms safety check interval
    `,
    eraApplicability: ["Agentic AI", "BCI"],
    risksMitigated: ["Physical harm", "Runaway processes", "Safety violations"]
  },
  {
    id: "neural-consent-vault",
    name: "Neural Consent Vault",
    category: "consent-vault",
    description: "Manages consent for neural data with revocation and audit capabilities",
    codeTemplate: `
interface NeuralConsent {
  userId: string;
  dataTypes: NeuralDataType[];
  purposes: string[];
  grantedAt: Date;
  expiresAt?: Date;
  revocable: boolean;
  auditTrail: ConsentEvent[];
}

interface ConsentEvent {
  type: 'granted' | 'revoked' | 'accessed' | 'modified';
  timestamp: Date;
  reason?: string;
  metadata?: Record<string, any>;
}

class NeuralConsentVault {
  private consents: Map<string, NeuralConsent> = new Map();
  
  async grantConsent(
    userId: string,
    dataTypes: NeuralDataType[],
    purposes: string[],
    options: { expiresAt?: Date; revocable?: boolean } = {}
  ): Promise<string> {
    const consentId = this.generateConsentId();
    const consent: NeuralConsent = {
      userId,
      dataTypes,
      purposes,
      grantedAt: new Date(),
      expiresAt: options.expiresAt,
      revocable: options.revocable ?? true,
      auditTrail: [{
        type: 'granted',
        timestamp: new Date(),
        metadata: { dataTypes, purposes }
      }]
    };
    
    this.consents.set(consentId, consent);
    return consentId;
  }
  
  async revokeConsent(consentId: string, reason?: string): Promise<boolean> {
    const consent = this.consents.get(consentId);
    if (!consent || !consent.revocable) return false;
    
    consent.auditTrail.push({
      type: 'revoked',
      timestamp: new Date(),
      reason
    });
    
    // Immediately halt any ongoing neural data processing
    await this.haltNeuralProcessing(consent.userId);
    
    this.consents.delete(consentId);
    return true;
  }
  
  validateAccess(
    consentId: string,
    dataType: NeuralDataType,
    purpose: string
  ): boolean {
    const consent = this.consents.get(consentId);
    if (!consent) return false;
    
    if (consent.expiresAt && new Date() > consent.expiresAt) {
      this.revokeConsent(consentId, 'expired');
      return false;
    }
    
    return consent.dataTypes.includes(dataType) && 
           consent.purposes.includes(purpose);
  }
  
  private async haltNeuralProcessing(userId: string): Promise<void> {
    // Implementation specific to neural processing pipeline
    // Must be fast enough to prevent unauthorized data use
  }
}
    `,
    usageExample: `
// In BCI application
const consentVault = new NeuralConsentVault();

// User grants consent for movement assistance
const consentId = await consentVault.grantConsent(
  userId,
  ['motor-cortex', 'movement-intention'],
  ['assistive-movement'],
  { expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } // 30 days
);

// Before processing neural data
if (consentVault.validateAccess(consentId, 'motor-cortex', 'assistive-movement')) {
  processNeuralData(data);
} else {
  logUnauthorizedAccess();
  throw new ConsentViolationError();
}

// User can revoke at any time
await consentVault.revokeConsent(consentId, 'user-requested');
    `,
    eraApplicability: ["BCI"],
    risksMitigated: ["Neural data misuse", "Unauthorized processing", "Privacy violations"]
  }
];

export function getToolsByCategory(category: string): GovernanceTool[] {
  return GOVERNANCE_TOOLS.filter(tool => tool.category === category);
}

export function getToolsByEra(era: string): GovernanceTool[] {
  return GOVERNANCE_TOOLS.filter(tool => tool.eraApplicability.includes(era));
}