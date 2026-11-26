const queue: { at: number; run: () => void }[] = [];
let clock = 0;

export function later(seconds: number, run: () => void): void {
  queue.push({ at: clock + seconds, run });
}

export function tickLater(dt: number): void {
  clock += dt;
  const due = queue.filter((item) => item.at <= clock);
  for (const item of due) {
    queue.splice(queue.indexOf(item), 1);
    item.run();
  }
}

export function resetLater(): void {
  queue.length = 0;
  clock = 0;
}
