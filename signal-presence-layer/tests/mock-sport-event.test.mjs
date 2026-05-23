import assert from 'node:assert/strict';
import { normalizeSignalEvent } from '../src/signal-engine.js';
import { derivePresenceState } from '../src/presence-controller.js';
import { createExecutionEnvelope } from '../src/execution-bridge.js';
import { createReceipt } from '../src/receipt-logger.js';

const input = {
  event_id: 'mock_sport_signal_001',
  source: 'mock-sport-feed',
  surface: 'tv-companion',
  mode: 'sport_companion',
  actor: { type: 'viewer', id: 'test-user' },
  context: { mate_mode: true, reaction_count: 7, sentiment: 'positive' },
  signal: { type: 'score_change', label: 'Goal scored', confidence: 0.9, weight: 1 }
};

const event = normalizeSignalEvent(input);
const state = derivePresenceState(event);
const envelope = createExecutionEnvelope(event, state);
const receipt = createReceipt(event, state, envelope);

assert.equal(state.strip.status, 'active');
assert.equal(receipt.output.receipt_generated, true);
assert.equal(receipt.output.signal_state, 'active');

console.log(JSON.stringify({ signal_state: state.strip.status, receipt_generated: true, receipt_id: receipt.receipt_id }, null, 2));
