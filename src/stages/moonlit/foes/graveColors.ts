import { hex, ramp } from "../../../utils/color";

export const GRAVE = {
  outline: hex("#08060f"),
  hollow: hex("#05040a"),
  bone: ramp(["#3a2e32", "#6a5a54", "#a4927a", "#d6c9ac", "#f6efd9"]),
  ghost: ramp(["#1f7a6c", "#5fe0c0", "#bff7e6", "#f4fffa"]),
  wax: ramp(["#5a5068", "#9a90a4", "#d2cad6", "#f2eef4"]),
  dirt: ramp(["#140e14", "#261c22", "#3e2e30", "#5c463e"]),
  cloth: ramp(["#0e0c1a", "#1a1830", "#2a2a4a", "#46487a"]),
  moss: ramp(["#101c1a", "#1e3430", "#34524a"]),
  brass: ramp(["#2e200e", "#4a3418", "#8a6a34", "#d2a85c", "#f4dca0"]),
  iron: ramp(["#0e0c16", "#222030", "#3a3850", "#5e5c78", "#9a98b8"]),
  rust: ramp(["#3a1e1a", "#6a3424", "#9a5434"]),
  hide: ramp(["#08060e", "#141022", "#221a36", "#38305a"]),
  veil: ramp(["#4a5488", "#7a88c4", "#b4c0ee", "#e6ecff"]),
  moon: ramp(["#2c2f6e", "#5a66c8", "#b4c0ff", "#e6eaff", "#ffffff"]),
  fire: ramp(["#5e2c8e", "#a04ad8", "#ff7ae0", "#ffd0ff", "#fff6ff"]),
} as const;

export const GHOST_EMBERS = [GRAVE.ghost[3], GRAVE.ghost[2], GRAVE.ghost[1], GRAVE.ghost[0]];
export const MOON_MOTES = [GRAVE.moon[4], GRAVE.moon[3], GRAVE.moon[2], GRAVE.moon[1]];
export const FIRE_MOTES = [GRAVE.fire[4], GRAVE.fire[3], GRAVE.fire[2], GRAVE.fire[1]];
export const DIRT_BITS = [GRAVE.dirt[3], GRAVE.dirt[2], GRAVE.bone[1], GRAVE.dirt[1]];
