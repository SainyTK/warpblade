const DENY_MS = 400;

export function shakeNode(node: HTMLElement): void {
  node.classList.remove("deny");
  void node.offsetWidth;
  node.classList.add("deny");
  setTimeout(() => node.classList.remove("deny"), DENY_MS);
}
