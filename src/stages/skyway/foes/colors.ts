import { hex, ramp } from "../../../utils/color";

export const SKY_FOES = {
  outline: hex("#0c0a14"),
  copper: ramp(["#2a1410", "#57281a", "#8a4424", "#bc6a34", "#e09a52"]),
  cream: ramp(["#6e5a48", "#a88e70", "#d8c4a0", "#f4ead2"]),
  talon: hex("#e8c45a"),
  talonDeep: hex("#8a6424"),
  hawkEye: hex("#fff2a0"),
  volt: ramp(["#1c3a6a", "#2f6cb0", "#4aa8f0", "#9ad8ff", "#f2fbff"]),
  bell: ramp(["#3a1440", "#6a2470", "#a43c9c", "#e070c8", "#ffc0ec"]),
  bellDeep: hex("#22082a"),
  jellyCore: hex("#fff6b8"),
  jellyCoreHot: hex("#ffffff"),
  frill: hex("#ff9ad8"),
  bronze: ramp(["#1e1a14", "#3e3420", "#6c5a32", "#a48a48", "#d8c070"]),
  verdigris: ramp(["#14302c", "#245048", "#3a7a68", "#62a88c"]),
  crimson: ramp(["#2a0c12", "#5a1620", "#922834", "#c84a4a"]),
  steel: ramp(["#262a34", "#4a5060", "#7c8496", "#b8c0d0", "#eef2fa"]),
  plume: ramp(["#4a5878", "#8aa0c8", "#d0def4", "#ffffff"]),
  visorGlow: hex("#9ad8ff"),
  roc: ramp(["#161a30", "#2c3458", "#46547e", "#6a7ca8", "#a0b4d8"]),
  rocBelly: ramp(["#6a6c88", "#9ea2bc", "#ccd0e0", "#f2f4fa"]),
  rocCrest: ramp(["#8a96b8", "#c8d2ea", "#ffffff"]),
  beak: ramp(["#5a3a10", "#a06a1c", "#e0a83a", "#ffe08a"]),
  rocEye: hex("#ffe27a"),
  rocEyeHot: hex("#ffffff"),
} as const;

export const SKY_SPARKS = {
  volt: [hex("#f2fbff"), hex("#9ad8ff"), hex("#4aa8f0"), hex("#2f6cb0")],
  jelly: [hex("#fff6ff"), hex("#ffc0ec"), hex("#e070c8"), hex("#6a2470")],
  feather: [hex("#e2e4f0"), hex("#b0b2c8"), hex("#6a74a4"), hex("#2e3456")],
  copper: [hex("#f4ead2"), hex("#e09a52"), hex("#bc6a34"), hex("#57281a")],
  bronze: [hex("#fff0b0"), hex("#d8c070"), hex("#a48a48"), hex("#3e3420")],
};
