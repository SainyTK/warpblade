/** Who runs each display frame: solo play when null, or a co-op room while one is open. */
export type FrameDriver = (now: number) => void;

let driver: FrameDriver | null = null;

export const frameDriver = (): FrameDriver | null => driver;

export function setFrameDriver(next: FrameDriver | null): void {
  driver = next;
}
