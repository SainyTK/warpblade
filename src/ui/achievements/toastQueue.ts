/** how long each banner stays; several at once follow one another */
const TOAST_MS = 3200;

const queue: HTMLElement[] = [];
let showing = false;

function next(): void {
  const box = queue.shift();
  showing = !!box;
  if (!box) return;
  box.style.setProperty("--toast-ms", `${TOAST_MS}ms`);
  document.body.append(box);
  setTimeout(() => {
    box.remove();
    next();
  }, TOAST_MS);
}

/** show a banner at the top of the screen once the ones before it are gone; achievements and discoveries share it */
export function showToast(box: HTMLElement): void {
  queue.push(box);
  if (!showing) next();
}
