export function normalizeSignalEvent(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('Signal event input must be an object');
  }

  const now = new Date().toISOString();
  const eventId = input.event_id || `sig_${Date.now()}`;

  return {
    event_id: eventId,
    source: input.source || 'unknown',
    surface: input.surface || 'unknown',
    mode: input.mode || 'ambient',
    actor: input.actor || { type: 'system', id: 'anonymous' },
    context: input.context || {},
    signal: {
      type: input.signal?.type || input.type || 'generic_signal',
      label: input.signal?.label || input.label || 'Unlabelled signal',
      confidence: Number(input.signal?.confidence ?? input.confidence ?? 0.5),
      weight: Number(input.signal?.weight ?? input.weight ?? 1)
    },
    received_at: input.received_at || now
  };
}

export function scoreSignal(event) {
  const confidence = Math.max(0, Math.min(1, Number(event.signal.confidence || 0)));
  const weight = Math.max(0, Number(event.signal.weight || 1));
  return Number((confidence * weight).toFixed(3));
}
