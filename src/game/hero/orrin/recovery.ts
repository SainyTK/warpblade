import { BACKLINE } from "../../../constants/orrin/backline";
import { hero } from "../../state";
import { orrin } from "./memory";

/** the skid after a Backline's yank, which any action may cut short */
export const backlineSettling = (): boolean => hero.state === "backline" && hero.st >= BACKLINE.load + BACKLINE.time;

/** a blow's recovery after it struck, or the skid after a Backline: the hook, a jump or a Backline may cut it short */
export const inRecovery = (): boolean =>
  (hero.state === "lash" && orrin.struck && orrin.swept >= 1 - 1e-6) || backlineSettling();
