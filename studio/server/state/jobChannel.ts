// Ported from the PWA Chat service (system/pwa/backend/chat/src/state/session-channel.ts).
import { randomUUID } from 'node:crypto';
import type { JobEvent, JobEventBody } from '../../shared/api';
import { JOB_EVENT_BUFFER } from '../constants';

/**
 * The numbered event stream of one job while this server runs. Agent processes come and go;
 * the channel outlives them, so a page can reload or reconnect and catch up from its last event.
 */
export class JobChannel {
  readonly epoch = randomUUID().slice(0, 8);
  private seq = 0;
  private readonly events: JobEvent[] = [];
  private readonly listeners = new Set<(event: JobEvent) => void>();

  get lastSeq(): number {
    return this.seq;
  }

  publish(body: JobEventBody): void {
    this.seq++;
    const event = { ...body, seq: this.seq } as JobEvent;
    this.events.push(event);
    if (this.events.length > JOB_EVENT_BUFFER) {
      this.events.shift();
    }
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  /** Events after `after`, or null when the buffer no longer reaches back that far. */
  eventsAfter(after: number): JobEvent[] | null {
    if (after > this.seq) {
      return null;
    }
    const first = this.events[0];
    if (first && after < first.seq - 1) {
      return null;
    }
    return this.events.filter((event) => event.seq > after);
  }

  subscribe(listener: (event: JobEvent) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
