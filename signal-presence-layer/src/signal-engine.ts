export type SignalActor = {
  type: string;
  id: string;
};

export type SignalEventInput = {
  event_id?: string;
  source?: string;
  surface?: string;
  mode?: string;
  actor?: SignalActor;
  context?: Record<string, unknown>;
  signal?: {
    type?: string;
    label?: string;
    confidence?: number;
    weight?: number;
  };
  type?: string;
  label?: string;
  confidence?: number;
  weight?: number;
  received_at?: string;
};

export type NormalisedSignalEvent = Required<Pick<SignalEventInput, 'source' | 'surface' | 'mode'>> & {
  event_id: string;
  actor: SignalActor;
  context: Record<string, unknown>;
  signal: {
    type: string;
    label: string;
    confidence: number;
    weight: number;
  };
  received_at: string;
};

export function normalizeSignalEvent(input: SignalEventInput): NormalisedSignalEvent {
  if (!input || typeof input !== 'object') {
    throw new Error('Signal event input must be an object');
  }

  return {
    event_id: input.event_id || `sig_${Date.now()}`,
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
    received_at: input.received_at || new Date().toISOString()
  };
}

export function scoreSignal(event: NormalisedSignalEvent): number {
  const confidence = Math.max(0, Math.min(1, Number(event.signal.confidence || 0)));
  const weight = Math.max(0, Number(event.signal.weight || 1));
  return Number((confidence * weight).toFixed(3));
}
