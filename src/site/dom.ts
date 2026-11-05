/** Small DOM builders for the site pages. Text always goes in as text, never as HTML. */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** a link; one to another site (GitHub) opens in a new tab */
export function link(href: string, text: string, className?: string): HTMLAnchorElement {
  const anchor = el("a", className, text);
  anchor.href = href;
  if (href.startsWith("http")) {
    anchor.target = "_blank";
    anchor.rel = "noopener";
  }
  return anchor;
}

/** a colour token such as "--heal" as the element's --accent */
export function setAccent(node: HTMLElement, token: string): void {
  node.style.setProperty("--accent", `var(${token})`);
}
