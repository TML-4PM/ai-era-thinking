export function createExecutionEnvelope(event, presenceState, action = {}) {
  return {
    envelope_id: `exec_${event.event_id}`,
    event_id: event.event_id,
    action: {
      type: action.type || 'surface_signal_state',
      target: action.target || presenceState.surface || 'signal-strip',
      priority: action.priority || presenceState.strip.intensity,
      payload: action.payload || {
        label: presenceState.strip.label,
        status: presenceState.strip.status,
        score: presenceState.strip.score
      }
    },
    routing: {
      requested_by: event.actor,
      bridge: 'signal-presence-layer.execution-bridge',
      mode: event.mode
    },
    created_at: new Date().toISOString()
  };
}

export function classifyExecution(envelope) {
  if (!envelope?.action?.type) return 'BLOCKED';
  if (!envelope?.action?.target) return 'PARTIAL';
  return 'DRY_RUN';
}
