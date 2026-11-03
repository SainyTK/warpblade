// Ported from the PWA Chat service (system/pwa/backend/chat/src/utils/live-timeline.ts).
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { ImageRef, JobEventBody, TimelineItem } from '../../shared/api';
import { blocks, INTERRUPTED, messageImages, textOf, toolResultText } from './content';

type Emit = (event: JobEventBody) => void;

/** Keeps a streamed image so the page can load it, and returns its URL. */
export type ImageUrl = (block: Record<string, unknown>) => string | null;

type StreamEvent = { type: string; [key: string]: unknown };

const API_ERRORS: Record<string, string> = {
  authentication_failed: 'The proxy rejected the agent credentials.',
  rate_limit: 'The account hit its usage limit. Try another model or wait.',
  overloaded: 'The model is overloaded. Try again shortly.',
  model_not_found: 'The proxy does not serve this model.',
  billing_error: 'The account has a billing problem.',
  server_error: 'The model provider returned a server error.',
  invalid_request: 'The model provider rejected the request.',
  max_output_tokens: 'The reply hit the output limit.',
};

/**
 * Every turn of a job's agent, built from Agent SDK messages as they arrive.
 * Each change is reported through `emit`, so an open page follows along and a reloaded one catches up.
 */
export class LiveTimeline {
  private readonly items = new Map<string, TimelineItem>();
  private blockIds = new Map<number, string>();
  private messageId = '';
  private readonly streamed = new Set<string>();
  private noticeCount = 0;

  constructor(
    initial: TimelineItem[],
    private readonly emit: Emit,
    private readonly imageUrl: ImageUrl,
  ) {
    for (const item of initial) {
      this.items.set(item.id, item);
    }
  }

  list(): TimelineItem[] {
    return [...this.items.values()];
  }

  upsert(item: TimelineItem): void {
    this.items.set(item.id, item);
    this.emit({ type: 'upsert', item });
  }

  notice(tone: 'info' | 'error', text: string): void {
    this.noticeCount++;
    this.upsert({ kind: 'notice', id: `notice-${Date.now()}-${this.noticeCount}`, tone, text });
  }

  private append(id: string, text: string): void {
    const item = this.items.get(id);
    if (!item || (item.kind !== 'text' && item.kind !== 'thinking') || !text) {
      return;
    }
    item.text += text;
    this.emit({ type: 'append', id, text });
  }

  /** Applies one SDK message. Returns true when it ends the turn. */
  apply(message: SDKMessage): boolean {
    if ('parent_tool_use_id' in message && message.parent_tool_use_id) {
      return false;
    }
    switch (message.type) {
      case 'stream_event':
        this.applyStreamEvent(message.event as unknown as StreamEvent);
        return false;
      case 'assistant':
        this.applyAssistant(message.message.id, message.message.content, message.error);
        return false;
      case 'user':
        this.applyUser(message.message.content);
        return false;
      case 'system':
        if (message.subtype === 'compact_boundary') {
          this.notice('info', 'The conversation was compacted to free context.');
        } else if (message.subtype === 'api_retry') {
          this.notice(
            'info',
            `Retrying the request (attempt ${message.attempt} of ${message.max_retries})`,
          );
        }
        return false;
      case 'result':
        this.finishTools();
        return true;
      default:
        return false;
    }
  }

  private applyStreamEvent(event: StreamEvent): void {
    if (event.type === 'message_start') {
      const message = event.message as { id?: unknown } | undefined;
      this.messageId = typeof message?.id === 'string' ? message.id : `message-${Date.now()}`;
      this.blockIds = new Map();
      return;
    }
    const index = typeof event.index === 'number' ? event.index : -1;
    if (event.type === 'content_block_start') {
      const block = event.content_block as { type?: unknown; id?: unknown; name?: unknown };
      const id = `${this.messageId}:${index}`;
      if (block.type === 'text' || block.type === 'thinking') {
        this.blockIds.set(index, id);
        this.streamed.add(this.messageId);
        this.upsert({ kind: block.type, id, text: '' });
      } else if (block.type === 'tool_use' && typeof block.id === 'string') {
        this.upsert({
          kind: 'tool',
          id: block.id,
          name: String(block.name ?? 'Tool'),
          input: {},
          status: 'running',
          result: null,
        });
      }
      return;
    }
    if (event.type === 'content_block_delta') {
      const id = this.blockIds.get(index);
      const delta = event.delta as { type?: unknown; text?: unknown; thinking?: unknown };
      if (!id) {
        return;
      }
      if (delta.type === 'text_delta' && typeof delta.text === 'string') {
        this.append(id, delta.text);
      } else if (delta.type === 'thinking_delta' && typeof delta.thinking === 'string') {
        this.append(id, delta.thinking);
      }
    }
  }

  private applyAssistant(messageId: string, content: unknown, error: string | undefined): void {
    blocks(content).forEach((block, index) => {
      if (block.type === 'tool_use' && typeof block.id === 'string') {
        const existing = this.items.get(block.id);
        this.upsert({
          kind: 'tool',
          id: block.id,
          name: String(block.name ?? 'Tool'),
          input: block.input ?? {},
          status: existing?.kind === 'tool' ? existing.status : 'running',
          result: existing?.kind === 'tool' ? existing.result : null,
        });
        return;
      }
      if (this.streamed.has(messageId)) {
        return;
      }
      const id = `${messageId}:full-${index}-${this.items.size}`;
      if (block.type === 'text' && textOf(block).trim()) {
        this.upsert({ kind: 'text', id, text: textOf(block) });
      } else if (block.type === 'thinking' && typeof block.thinking === 'string') {
        this.upsert({ kind: 'thinking', id, text: block.thinking });
      }
    });
    if (error) {
      this.notice('error', API_ERRORS[error] ?? 'The model request failed.');
    }
  }

  private applyUser(content: unknown): void {
    const images = messageImages(content);
    for (const block of blocks(content)) {
      if (block.type === 'tool_result') {
        const tool = this.items.get(String(block.tool_use_id));
        if (tool?.kind === 'tool') {
          const isError = block.is_error === true;
          const refs: ImageRef[] = images
            .filter((image) => image.toolUseId === tool.id)
            .flatMap((image) => {
              const src = this.imageUrl(image.block);
              return src ? [{ src, alt: 'Tool output image' }] : [];
            });
          this.upsert({
            ...tool,
            status: isError ? 'error' : 'done',
            result: { text: toolResultText(block), isError, images: refs },
          });
        }
      } else if (block.type === 'text' && INTERRUPTED.test(textOf(block))) {
        this.notice('info', 'Stopped');
      }
    }
  }

  /** A turn that ended without a tool's result, for example after Stop, leaves no tool spinning. */
  private finishTools(): void {
    for (const item of this.items.values()) {
      if (item.kind === 'tool' && item.status === 'running') {
        this.upsert({
          ...item,
          status: 'error',
          result: item.result ?? { text: 'No result.', isError: true, images: [] },
        });
      }
    }
  }
}
