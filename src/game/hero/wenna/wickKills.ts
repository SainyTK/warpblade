/** a Wick's blow is landing now: a kill it makes counts for Many Hands */
let striking = false;

/** run a Wick's blow (a bite, a burst, a lunge) so a kill it makes counts as her Wicks' */
export function byWick(strike: () => void): void {
  const was = striking;
  striking = true;
  try {
    strike();
  } finally {
    striking = was;
  }
}

/** the blow landing now is a Wick's */
export const wickStriking = (): boolean => striking;
