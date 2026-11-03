// Ported from the PWA Chat service (system/pwa/backend/chat/src/http/events.ts).
import type { ServerResponse } from 'node:http';
import type { JobEvent } from '../../shared/api';
import { SSE_HEARTBEAT_MS } from '../constants';
import type { JobChannel } from '../state/jobChannel';

/**
 * Streams a job's events as server-sent events, starting after the page's last one.
 * When the page is too far behind or on another epoch, one reset event tells it to reload the view.
 */
export function streamEvents(
  res: ServerResponse,
  channel: JobChannel,
  epoch: string,
  after: number,
): void {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-store',
    Connection: 'keep-alive',
  });
  const send = (event: JobEvent) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };
  const backlog = epoch === channel.epoch ? channel.eventsAfter(after) : null;
  if (!backlog) {
    send({ type: 'reset', seq: channel.lastSeq });
    res.end();
    return;
  }
  for (const event of backlog) {
    send(event);
  }
  const unsubscribe = channel.subscribe(send);
  const heartbeat = setInterval(() => res.write(': keep-alive\n\n'), SSE_HEARTBEAT_MS);
  res.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
}
