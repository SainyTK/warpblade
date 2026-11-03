// Pure readers for Anthropic Messages content blocks as they appear in streams and transcripts.

/** Tool output shown in the browser is capped. The full output stays in the session file. */
const RESULT_DISPLAY_LIMIT = 30_000;

export type Block = { type?: unknown; [key: string]: unknown };

export function blocks(content: unknown): Block[] {
  if (typeof content === 'string') {
    return [{ type: 'text', text: content }];
  }
  return Array.isArray(content)
    ? content.filter((block): block is Block => typeof block === 'object' && block !== null)
    : [];
}

export function textOf(block: Block): string {
  return typeof block.text === 'string' ? block.text : '';
}

function truncate(text: string): string {
  return text.length > RESULT_DISPLAY_LIMIT
    ? `${text.slice(0, RESULT_DISPLAY_LIMIT)}\n\n[Output shortened to ${RESULT_DISPLAY_LIMIT.toLocaleString('en-US')} characters]`
    : text;
}

/** The text of a tool_result block. Its images are shown separately as thumbnails. */
export function toolResultText(block: Block): string {
  const text = blocks(block.content)
    .filter((part) => part.type === 'text')
    .map(textOf)
    .join('\n');
  return truncate(text.trim());
}

export interface MessageImage {
  block: Block;
  /** The tool call whose result holds the image, or null for an image the owner attached. */
  toolUseId: string | null;
}

/**
 * Every image in a message in document order: attached images and images inside tool results.
 * An image's position in this list is its index in image URLs.
 */
export function messageImages(content: unknown): MessageImage[] {
  const images: MessageImage[] = [];
  for (const block of blocks(content)) {
    if (block.type === 'image') {
      images.push({ block, toolUseId: null });
    } else if (block.type === 'tool_result') {
      for (const inner of blocks(block.content)) {
        if (inner.type === 'image') {
          images.push({ block: inner, toolUseId: String(block.tool_use_id) });
        }
      }
    }
  }
  return images;
}

/** A base64 image block's media type and data, or null for anything else. */
export function imageSource(block: Block): { mediaType: string; data: string } | null {
  const source = block.source as
    | { type?: unknown; media_type?: unknown; data?: unknown }
    | undefined;
  if (block.type !== 'image' || source?.type !== 'base64') {
    return null;
  }
  return typeof source.media_type === 'string' && typeof source.data === 'string'
    ? { mediaType: source.media_type, data: source.data }
    : null;
}

/** Claude Code's own note in place of a reply after Stop. */
export const INTERRUPTED = /^\[Request interrupted by user/;
