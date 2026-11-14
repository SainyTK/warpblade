import { BASE_HERO_COLORS, type HeroColors } from "../../../constants/palette";
import { hex } from "../../../utils/color";

/**
 * Calder's colours by material, each deep to glint: dark messy hair, a gunmetal duster, gunmetal fittings, brass trim and
 * rounds, olive trousers, worn leather boots and heavy gloves, a rust scarf and a steel blade. The iris carries his
 * phosphor green, which also lights the warp crystal in the cylinder, the groove of the blade and the goggle lenses.
 */
export const CALDER_COLORS: HeroColors = {
  ...BASE_HERO_COLORS,
  skinLight: hex("#f8d8b4"),
  skin: hex("#e6b890"),
  skinShade: hex("#bf8768"),
  skinDeep: hex("#8e5a46"),
  hairGlint: hex("#b8a894"),
  hairLight: hex("#6e5e52"),
  hair: hex("#463a34"),
  hairDark: hex("#2c2422"),
  hairDeep: hex("#191311"),
  eyeWhite: hex("#f0f6e8"),
  iris: hex("#9ae05a"),
  pupil: hex("#14200e"),
  coatLight: hex("#727c88"),
  coat: hex("#4c5460"),
  coatDark: hex("#333944"),
  coatDeep: hex("#1d2129"),
  steelGlint: hex("#eef4ee"),
  steelLight: hex("#a4acb0"),
  steel: hex("#686f74"),
  steelDark: hex("#3e4448"),
  steelDeep: hex("#212528"),
  trimLight: hex("#ffe49a"),
  trim: hex("#c99a3c"),
  trimDark: hex("#7c5a22"),
  pantsLight: hex("#5c5644"),
  pants: hex("#3e392c"),
  pantsDark: hex("#27241b"),
  bootLight: hex("#8c623e"),
  boot: hex("#5c3e28"),
  bootDark: hex("#2f1f15"),
  gloveLight: hex("#86603e"),
  glove: hex("#563a26"),
  scarfLight: hex("#d47a44"),
  scarf: hex("#a4522c"),
  scarfDark: hex("#64321d"),
  bladeEdge: hex("#f6fff2"),
  blade: hex("#bcc6c6"),
  bladeBack: hex("#66706e"),
  bladeDeep: hex("#363c3c"),
  hilt: hex("#2a201c"),
};
