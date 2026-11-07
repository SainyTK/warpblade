import { hex } from "../../utils/color";

/** Bruising Knuckles: stacks tick this often; a spread or a shatter reaches this far; a foe that took spread bruises
 *  cannot spread them again for this long (G5); and the mark's colours */
export const BRUISE = {
  every: 0.5,
  reach: 40,
  noChain: 0.5,
  /** dark and bright bruise colours of the mark drawn on a foe */
  dark: hex("#4a1838"),
  bright: hex("#a8406a"),
} as const;
