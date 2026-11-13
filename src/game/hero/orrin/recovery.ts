import { hero } from "../../state";
import { orrin } from "./memory";

/** a blow's recovery after it struck: a jump or any shared action may cut it short */
export const inRecovery = (): boolean => hero.state === "lash" && orrin.struck && orrin.swept >= 1 - 1e-6;
