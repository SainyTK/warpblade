import { el } from "../dom";

/** the studio's answer, set apart under the player's message */
export function studioReply(text: string): HTMLElement {
  const reply = el("div", "studio-reply");
  reply.append(el("p", "studio-reply-label", "Studio"), el("p", "studio-reply-text", text));
  return reply;
}
