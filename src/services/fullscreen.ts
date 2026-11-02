/** The browser's Fullscreen API. Phones that lack it (iPhone Safari) get no fullscreen option. */
export const canFullscreen = (): boolean => document.fullscreenEnabled === true;
export const isFullscreen = (): boolean => document.fullscreenElement !== null;

export function toggleFullscreen(): void {
  if (!canFullscreen()) return;
  const request = isFullscreen() ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  request.catch(() => {
    // the browser may refuse outside a key press or tap; the option simply stays as it was
  });
}
export function onFullscreenChange(listener: () => void): void {
  document.addEventListener("fullscreenchange", listener);
}
