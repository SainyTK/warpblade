import { hex, ramp } from "../../utils/color";

export const BLIGHT = {
  outline: hex("#100812"),
  bark: ramp(["#170d16", "#281824", "#3e2a36", "#58404a", "#7a5e62"]),
  barkGlint: hex("#a08880"),
  rot: ramp(["#18240f", "#2c4018", "#4a6424", "#7a9a32", "#b4d24a"]),
  spore: ramp(["#4a6a1e", "#8ab83a", "#c6e05a", "#eeff9a", "#fbffe0"]),
  fungus: ramp(["#173c44", "#256a6c", "#3eaa9c", "#8ae8cc", "#e2fff2"]),
  flesh: ramp(["#22091c", "#43142f", "#6c2250", "#a23e72", "#de7ea0", "#ffd2dc"]),
  vein: ramp(["#3a0c2a", "#7a1e52", "#c8408a", "#ff9ad0"]),
  poison: ramp(["#16240c", "#2e4c12", "#5e921c", "#a6dc36", "#e6ff8c"]),
  bone: ramp(["#5a5040", "#9a8e74", "#cfc4a6", "#f2ead2"]),
  sap: ramp(["#4a2408", "#8a5014", "#d08a26", "#ffd27a"]),
  shell: ramp(["#10121c", "#212b3b", "#33485a", "#4f7682", "#8ab8ae"]),
  sheen: hex("#8a6ab4"),
  sheenHot: hex("#c8b0ff"),
  petal: ramp(["#320a1c", "#621632", "#9a2446", "#d64c62", "#ff9a9a"]),
  maw: hex("#1c0410"),
  tooth: hex("#efe4c8"),
  stem: ramp(["#14200e", "#253a16", "#3c5a20", "#5e8030"]),
  puff: ramp(["#2e1c34", "#4e3256", "#73507a", "#a07ca0", "#d4b8cc"]),
  eye: hex("#f4ff9a"),
  eyeHot: hex("#ffffff"),
  mark: hex("#c6e05a"),
  markHot: hex("#f6ffc0"),
} as const;

export const BLIGHT_SPARKS = {
  spore: [hex("#fbffe0"), hex("#eeff9a"), hex("#c6e05a"), hex("#6a8a2a")],
  sap: [hex("#ffe8a8"), hex("#ffd27a"), hex("#d08a26"), hex("#6a3a10")],
  flesh: [hex("#ffd2dc"), hex("#de7ea0"), hex("#a23e72"), hex("#43142f")],
  bark: [hex("#a08880"), hex("#7a5e62"), hex("#3e2a36"), hex("#170d16")],
  shell: [hex("#c8b0ff"), hex("#6e9a98"), hex("#283a4a"), hex("#0e1018")],
};
