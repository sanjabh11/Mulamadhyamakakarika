/**
 * Server-side analytics emitter.
 *
 * In production this can be wired to a queue or warehouse stream.
 * For now we emit normalized JSON logs for ingestion by log pipelines.
 */
export function emitServerAnalyticsEvent(eventName, payload = {}) {
  const event = {
    eventName,
    eventId: `${eventName}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    source: 'server',
    ...payload
  };

  console.log('[ANALYTICS_EVENT]', JSON.stringify(event));
  return event;
}

export default {
  emitServerAnalyticsEvent
};
