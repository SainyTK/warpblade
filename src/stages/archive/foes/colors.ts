import { hex, ramp } from "../../../utils/color";

export const FOE = {
  outline: hex("#06050c"),
  ink: ramp(["#0a0814", "#16122a", "#241e44", "#383064", "#544a8e"]),
  inkSheen: hex("#9a90e4"),
  inkGlint: hex("#e4e0ff"),
  eye: hex("#8ff8de"),
  eyeHot: hex("#f0fffa"),
  eyeDeep: hex("#2a8a7a"),
  letter: hex("#6ee8cc"),
  letterHot: hex("#d8fff2"),
  paper: ramp(["#3e382e", "#6e6450", "#a89a7a", "#d8ccaa", "#f4ecd2"]),
  paperGlint: hex("#fffcf0"),
  paperShade: hex("#8a7c60"),
  text: hex("#4a4038"),
  bronze: ramp(["#121a18", "#22322c", "#3a5446", "#5e7e64", "#92ae8a"]),
  bronzeLit: hex("#c4d8ae"),
  verdigris: hex("#5aa894"),
  leather: ramp(["#2a0c12", "#4e1820", "#7a2630", "#a8404a"]),
  gilt: hex("#e6be64"),
  giltDim: hex("#9a7a3a"),
  glyph: ramp(["#6a3a10", "#b8701e", "#f0a838", "#ffd884", "#fff6d8"]),
  flame: ramp(["#4a1a10", "#a8461c", "#ee9232", "#ffd470", "#fff8dc"]),
  spectre: ramp(["#0c2426", "#17403f", "#286a64", "#4ea896", "#9ce8d2"]),
  iron: ramp(["#0c0c12", "#1c1e26", "#323640", "#545a66", "#8a929e"]),
  wax: ramp(["#3a0a12", "#6e1624", "#a82a38", "#d85a5a"]),
  steel: ramp(["#20242e", "#4a5262", "#8a94a6", "#d0d8e6"]),
} as const;

export const FOE_SPARKS = {
  ink: [hex("#c8c0ff"), hex("#7a70c8"), hex("#3a3264"), hex("#16122a")],
  paper: [hex("#fffcf0"), hex("#e8dcbc"), hex("#a89a7a"), hex("#6e6450")],
  glyph: [hex("#fff6d8"), hex("#ffd884"), hex("#f0a838"), hex("#b8701e")],
  letter: [hex("#f0fffa"), hex("#8ff8de"), hex("#3ab89c"), hex("#1a5a4c")],
  flame: [hex("#fff8dc"), hex("#ffd470"), hex("#ee9232"), hex("#a8461c")],
  spectre: [hex("#e8fff6"), hex("#9ce8d2"), hex("#4ea896"), hex("#17403f")],
};
