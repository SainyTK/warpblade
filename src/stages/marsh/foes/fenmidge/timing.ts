import { game } from "../../../../game/state";
import { waveScale } from "../../../../utils/progression";
import { MIDGE } from "./constants";

export const rearTime = (): number => MIDGE.rear * waveScale(game.wave).windup;
