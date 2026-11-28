export function formatNumber(value: number | null): string {
  if (value === null) {
    return "none";
  }
  if (Math.abs(value) >= 10_000) {
    return value.toExponential(2);
  }
  return Number(value.toPrecision(3)).toString();
}
