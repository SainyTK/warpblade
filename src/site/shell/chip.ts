import { el, setAccent } from "../dom";

/** a small pixel label in one colour token */
export function chip(text: string, accent: string, className = ""): HTMLSpanElement {
  const node = el("span", `chip ${className}`.trim(), text);
  setAccent(node, accent);
  return node;
}
