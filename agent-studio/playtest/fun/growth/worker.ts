import { parentPort, workerData } from "node:worker_threads";
import { measureSample } from "./measureSample";
import type { GrowthSample } from "./types/model";

parentPort?.postMessage(await measureSample(workerData as GrowthSample));
