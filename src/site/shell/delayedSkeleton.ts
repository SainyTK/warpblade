/** fast loads never flash a skeleton: it appears only when the wait passes this */
const SKELETON_DELAY_MS = 150;

/** Puts the skeleton into the container once the wait passes the delay. Call the returned function when the data
    arrives; it cancels the skeleton if it has not appeared yet. */
export function showSkeletonAfterDelay(container: HTMLElement, skeleton: () => Node): () => void {
  const timer = window.setTimeout(() => container.replaceChildren(skeleton()), SKELETON_DELAY_MS);
  return () => window.clearTimeout(timer);
}
