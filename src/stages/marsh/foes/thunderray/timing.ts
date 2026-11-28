import { game } from "../../../../game/state";
import { waveScale } from "../../../../utils/progression";
import { RAY } from "./constants";

export const chargeTime = (): number => RAY.charge * waveScale(game.wave).windup;
export const tuckTime = (): number => RAY.tuck * waveScale(game.wave).windup;
