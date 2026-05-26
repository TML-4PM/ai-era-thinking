import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeSignalEvent } from '../src/signal-engine.js';
import { derivePresenceState } from '../src/presence-controller.js';
import { createExecutionEnvelope } from '../src/execution-bridge.js';
import { createReceipt, serializeReceipt } from '../src/receipt-logger.js';

const here = dirname(fileURLToPath(import.meta.url));
const runtimeDir = resolve(here, '../test/runtime');

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
const receipt = createReceipt(event, state, envelope, {
  evidence: [
    'mock_signal_event processed by signal-engine',
    'presence-controller produced active signal strip state',
    'execution-bridge produced execution envelope',
    'receipt-logger emitted execution_receipt.json',
    'repro: npm test --prefix signal-presence-layer'
  ],
  gaps: [
    'external bridge endpoint not invoked by repository smoke test',
    'ledger database write not executed by repository smoke test'
  ],
  next_action: 'upload runtime receipt bundle and bind ledger adapter evidence to issue 2'
});

assert.equal(state.strip.status, 'active');
assert.equal(receipt.output.receipt_generated, true);
assert.equal(receipt.output.signal_state, 'active');
assert.equal(receipt.execution.classification, 'DRY_RUN');

mkdirSync(runtimeDir, { recursive: true });
writeFileSync(resolve(runtimeDir, 'execution_receipt.json'), serializeReceipt(receipt) + '\n', 'utf8');
writeFileSync(resolve(runtimeDir, 'runtime-proof.log'), 'PASS signal_state=active receipt_generated=true receipt_id=' + receipt.receipt_id + '\n', 'utf8');
writeFileSync(resolve(runtimeDir, 'ledger_receipt.json'), JSON.stringify({
  task_id: receipt.task_id,
  intent: 'bind Signal Presence smoke receipt to Reality Ledger adapter contract',
  execution: 'repository smoke test generated runtime receipt bundle',
  output: 'signal-presence-layer/test/runtime/execution_receipt.json',
  status: 'PARTIAL',
  evidence: receipt.evidence,
  gaps: receipt.gaps,
  score: 0.88
}, null, 2) + '\n', 'utf8');

console.log(JSON.stringify({
  status: receipt.status,
  signal_state: state.strip.status,
  receipt_generated: true,
  receipt_id: receipt.receipt_id,
  receipt_path: 'signal-presence-layer/test/runtime/execution_receipt.json',
  log_path: 'signal-presence-layer/test/runtime/runtime-proof.log',
  ledger_path: 'signal-presence-layer/test/runtime/ledger_receipt.json'
}, null, 2));
