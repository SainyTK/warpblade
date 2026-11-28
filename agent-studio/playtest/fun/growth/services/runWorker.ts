import { Worker } from "node:worker_threads";

export function runWorker<Input, Output>(entry: URL, input: Input): Promise<Output> {
  const worker = new Worker(entry, { workerData: input, execArgv: ["--import", import.meta.resolve("tsx")] });
  return new Promise((resolve, reject) => {
    let result: { value: Output } | null = null;
    worker.once("message", (value: Output) => {
      result = { value };
    });
    worker.once("error", reject);
    worker.once("exit", (code) => {
      if (result) {
        resolve(result.value);
      } else {
        reject(new Error(`the growth worker exited with code ${code} and no readings`));
      }
    });
  });
}
