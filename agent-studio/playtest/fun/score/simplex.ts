export function projectToSimplex(values: readonly number[]): number[] {
  const sorted = [...values].sort((a, b) => b - a);
  let running = 0;
  let threshold = 0;
  for (let i = 0; i < sorted.length; i++) {
    running += sorted[i];
    const candidate = (running - 1) / (i + 1);
    if (sorted[i] - candidate > 0) {
      threshold = candidate;
    }
  }
  return values.map((value) => Math.max(0, value - threshold));
}
