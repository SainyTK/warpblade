import { game } from "../../../../game/state";
import { waveScale } from "../../../../utils/progression";
import { BOGLING } from "./constants";

export const squashTime = (): number => BOGLING.squash * waveScale(game.wave).windup;
