export type PresenceState = {
  state_id: string;
  event_id: string;
  visible: boolean;
  status: string;
  score: number;
};

export function derivePresenceState(event: { event_id: string; signal: { confidence?: number; weight?: number } }): PresenceState {
  const confidence = Number(event.signal.confidence ?? 0.5);
  const weight = Number(event.signal.weight ?? 1);
  const score = Number((confidence * weight).toFixed(3));
  return {
    state_id: 'presence_' + event.event_id,
    event_id: event.event_id,
    visible: score >= 0.25,
    status: score >= 0.25 ? 'active' : 'quiet',
    score
  };
}
