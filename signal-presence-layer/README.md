# Signal Presence Layer

Status: PARTIAL runtime scaffold.

This package turns the original Signal Presence receipt into a runnable TypeScript-oriented scaffold for context -> signal -> decision -> execution -> receipt -> memory -> value loop.

## What is here

- Signal engine for normalising incoming events
- Presence controller for deriving Signal Strip state
- Execution bridge stub for downstream action envelopes
- Receipt logger for Reality Ledger-shaped receipts
- Agent market radar stub for agent registry ingestion
- JSON schemas for signal events, execution receipts, and agent registry entries
- Browser extension skeleton
- Minimal React component skeletons
- Mock sport-event test fixture and expected receipt path

## First executable path

```bash
cd signal-presence-layer
npm install
npm test
```

The first test path is deliberately small:

```text
mock sport event signal -> signal strip state -> execution receipt JSON
```

## Reality state

This scaffold is REAL as committed repository structure. Runtime execution remains PARTIAL until CI, local test output, deployment target, and ledger database write are captured.

## Required next proof

1. Run `npm test` in the package.
2. Capture test output.
3. Write a Reality Ledger entry.
4. Attach the receipt to GitHub issue #2.
5. Deploy or bind to a Vercel/Lovable/Synal surface.
