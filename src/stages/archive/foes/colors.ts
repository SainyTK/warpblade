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
} as const;

export const FOE_SPARKS = {
  ink: [hex("#c8c0ff"), hex("#7a70c8"), hex("#3a3264"), hex("#16122a")],
  paper: [hex("#fffcf0"), hex("#e8dcbc"), hex("#a89a7a"), hex("#6e6450")],
  glyph: [hex("#fff6d8"), hex("#ffd884"), hex("#f0a838"), hex("#b8701e")],
  letter: [hex("#f0fffa"), hex("#8ff8de"), hex("#3ab89c"), hex("#1a5a4c")],
};
