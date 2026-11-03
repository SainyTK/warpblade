import { execFile } from 'node:child_process';

/** Runs a command to completion and returns its output, or throws with its stderr. */
export function run(command: string, args: string[], cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(command, args, { cwd, maxBuffer: 16 * 1024 * 1024 }, (problem, stdout, stderr) => {
      if (problem) {
        reject(new Error(stderr.trim() || problem.message));
      } else {
        resolve(stdout);
      }
    });
  });
}
