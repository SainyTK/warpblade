import { hex, ramp } from "../../utils/color";

export const FORGE = {
  outline: hex("#0b0607"),
  soot: hex("#120c0d"),
  iron: ramp(["#16100f", "#2a201e", "#433431", "#5f4c46", "#86706a"]),
  ironGlint: hex("#c4aca0"),
  plate: ramp(["#1e1515", "#3a2a28", "#5c4540", "#836660", "#b09088"]),
  crust: ramp(["#1a100d", "#2e1d18", "#4a2e24", "#6b4434"]),
  molten: ramp(["#5a1206", "#9a2a0c", "#d8521a", "#f8922c", "#ffcc5e", "#fff4c8"]),
  steel: ramp(["#1c2230", "#323c50", "#4e5c74", "#7486a0", "#a8b8cc"]),
  steelGlint: hex("#e0ecf6"),
  brass: ramp(["#4a2c12", "#7a5222", "#b08236", "#e0b85e"]),
  brassGlint: hex("#fff0b0"),
  leather: ramp(["#1e1014", "#361c20", "#562e30", "#7a4644"]),
  wingVein: hex("#ff7a2a"),
  hide: ramp(["#1a1214", "#2c2024", "#46343a"]),
  beard: ramp(["#5a1a0c", "#a8380e", "#ee7420", "#ffbc4c"]),
  wood: ramp(["#26160e", "#40261a", "#5e3a26"]),
  eye: hex("#fff2a8"),
  eyeHot: hex("#ffffff"),
} as const;

export const FORGE_SPARKS = {
  molten: [hex("#fff4c8"), hex("#ffcc5e"), hex("#f8922c"), hex("#d8521a")],
  ember: [hex("#ffe08a"), hex("#ff9a36"), hex("#d8481a"), hex("#6a1a0a")],
  steel: [hex("#e0ecf6"), hex("#a8b8cc"), hex("#7486a0"), hex("#4e5c74")],
  soot: [hex("#4a3a36"), hex("#2e2220"), hex("#1a1210"), hex("#100a0a")],
};
