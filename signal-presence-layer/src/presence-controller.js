import { scoreSignal } from './signal-engine.js';

export function derivePresenceState(event) {
  const score = scoreSignal(event);
  const intensity = score >= 0.75 ? 'high' : score >= 0.4 ? 'medium' : 'low';
  const visible = score >= 0.25;

  return {
    state_id: `presence_${event.event_id}`,
    event_id: event.event_id,
    visible,
    mode: event.mode,
    surface: event.surface,
    strip: {
      label: event.signal.label,
      intensity,
      score,
      status: visible ? 'active' : 'quiet'
    },
    mate_mode: {
      enabled: event.context?.mate_mode === true,
      reaction_count: Number(event.context?.reaction_count || 0),
      sentiment: event.context?.sentiment || 'neutral'
    },
    updated_at: new Date().toISOString()
  };
}
