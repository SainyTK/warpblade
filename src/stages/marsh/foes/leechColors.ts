import { hex, ramp } from "../../../utils/color";

export const LEECH_COLORS = {
  outline: hex("#0b0a10"),
  deep: hex("#160d10"),
  dark: hex("#2a1a1e"),
  body: hex("#46292a"),
  light: hex("#6c4436"),
  rim: hex("#a2704e"),
  glint: hex("#f0d8b8"),
  ring: hex("#24151a"),
  stripe: hex("#b08a3a"),
  stripeLight: hex("#e0c070"),
  stripeDark: hex("#6e5222"),
  belly: hex("#7a6248"),
  bellyLight: hex("#a88c66"),
  bellyDark: hex("#4a3a2a"),
  maw: hex("#1a0810"),
  gum: hex("#8c3a4e"),
  tooth: hex("#efe6d2"),
  toothDark: hex("#a09078"),
  rift: hex("#9a6ad8"),
  riftHot: hex("#e8d0ff"),
  mud: hex("#3a2e24"),
  mudLight: hex("#5a4a36"),
  mudRim: hex("#8a7a5a"),
  mudDark: hex("#211a16"),
  wetSky: hex("#a9bace"),
  wetSkyDim: hex("#6f8196"),
} as const;

export const LEECH_SPARKS = ramp(["#8a7a5a", "#5a4a36", "#3a2e24", "#211a16"]);

export const LEECH_HITS = {
  bite: 15,
  erupt: 17,
  touch: 7,
} as const;
