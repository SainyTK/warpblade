function ranks(values: readonly number[]): number[] {
  const order = values.map((_, i) => i).sort((a, b) => values[a] - values[b]);
  const result = new Array<number>(values.length).fill(0);
  let start = 0;
  while (start < order.length) {
    let end = start;
    while (end + 1 < order.length && values[order[end + 1]] === values[order[start]]) end++;
    for (let k = start; k <= end; k++) result[order[k]] = (start + end) / 2 + 1;
    start = end + 1;
  }
  return result;
}

const average = (values: readonly number[]): number => values.reduce((sum, v) => sum + v, 0) / values.length;

export function spearman(x: readonly number[], y: readonly number[]): number {
  const rx = ranks(x);
  const ry = ranks(y);
  const mx = average(rx);
  const my = average(ry);
  let num = 0;
  let sx = 0;
  let sy = 0;
  for (let i = 0; i < rx.length; i++) {
    num += (rx[i] - mx) * (ry[i] - my);
    sx += (rx[i] - mx) ** 2;
    sy += (ry[i] - my) ** 2;
  }
  const den = Math.sqrt(sx * sy);
  return den ? num / den : 0;
}
