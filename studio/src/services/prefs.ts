// Per-browser conveniences. Reads and writes never throw, so a blocked storage only loses the convenience.
const LAST_SKETCH = 'warpblade-studio:last-sketch';

export function lastSketchId(): string | null {
  try {
    return localStorage.getItem(LAST_SKETCH);
  } catch {
    return null;
  }
}

export function rememberSketch(id: string): void {
  try {
    localStorage.setItem(LAST_SKETCH, id);
  } catch {
    // Storage blocked: the studio opens the newest sketch instead.
  }
}
