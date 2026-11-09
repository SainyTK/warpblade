/**
 * Settle with the promise, or reject once this many minutes of wall time pass. A game stuck in an endless loop freezes
 * the page, and every call into it then waits forever; this turns that into a clear failure.
 */
export function withWallLimit<T>(work: Promise<T>, minutes: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const limit = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(
        new Error(`${label} ran past ${minutes} minutes of wall time; the page may be frozen by an endless loop.`),
      );
    }, minutes * 60_000);
  });
  return Promise.race([work, limit]).finally(() => clearTimeout(timer));
}
