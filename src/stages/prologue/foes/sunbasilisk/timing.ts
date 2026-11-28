import { game } from "../../../../game/state";
import { waveScale } from "../../../../utils/progression";
import { BASILISK } from "./constants";

export const gazeTime = (): number => BASILISK.gaze * waveScale(game.wave).windup;
export const coilTime = (): number => BASILISK.coil * waveScale(game.wave).windup;
export const rearTime = (): number => BASILISK.rear * waveScale(game.wave).windup;
