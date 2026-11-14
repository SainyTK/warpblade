/** the best this browser has done in solo runs */
export interface RunRecords {
  /** the fastest run time, in seconds, to clear each wave: index 0 is wave 1; its length is the most waves cleared */
  splits: number[];
}

/** a number of waves cleared and the run time it took */
export interface WaveClear {
  waves: number;
  seconds: number;
}
