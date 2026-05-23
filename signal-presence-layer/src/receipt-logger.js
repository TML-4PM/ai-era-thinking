import { classifyExecution } from './execution-bridge.js';

export function createReceipt(event, presenceState, executionEnvelope, overrides = {}) {
  const classification = overrides.classification || classifyExecution(executionEnvelope);
  return {
    receipt_id: overrides.receipt_id || `receipt_${event.event_id}`,
    task_id: overrides.task_id || 'signal_presence_mock_event_001',
    intent: overrides.intent || 'convert signal event into presence state and execution envelope',
    execution: {
      event_id: event.event_id,
      presence_state_id: presenceState.state_id,
      envelope_id: executionEnvelope.envelope_id,
      classification
    },
    output: {
      signal_state: presenceState.strip.status,
      receipt_generated: true,
      score: presenceState.strip.score
    },
    status: classification === 'BLOCKED' ? 'BLOCKED' : 'PARTIAL',
    evidence: overrides.evidence || [
      'local module execution path constructed',
      'mock event transformed into presence state',
      'execution envelope constructed'
    ],
    gaps: overrides.gaps || [
      'no external bridge call executed',
      'no ledger database write confirmed',
      'no deployment target confirmed'
    ],
    next_action: overrides.next_action || 'run npm test and bind output to issue receipt',
    created_at: new Date().toISOString()
  };
}

export function serializeReceipt(receipt) {
  return JSON.stringify(receipt, null, 2);
}
