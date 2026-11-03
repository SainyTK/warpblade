import { type ChildProcess, spawn } from 'node:child_process';
import { createServer } from 'node:net';
import type { PreviewState } from '../../shared/api';
import { PREVIEW_START_MS } from '../constants';

/** A free loopback port, found by letting the system pick one. */
function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const address = probe.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      probe.close(() => resolve(port));
    });
  });
}

const LOCAL_URL = /Local:\s+(http:\/\/127\.0\.0\.1:\d+\/?)/;
// Vite colors its banner; the URL is read from plain text.
const ANSI = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');

/** The game's Vite dev server in a job's folder, so the owner can play what the agent built. */
export class Preview {
  state: PreviewState = { status: 'starting', url: null, error: null };
  private child: ChildProcess | null = null;
  private stopped = false;

  constructor(
    private readonly cwd: string,
    private readonly onChange: (state: PreviewState) => void,
  ) {}

  async start(): Promise<void> {
    const port = await freePort();
    const child = spawn(
      'npx',
      ['vite', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
      { cwd: this.cwd, stdio: ['ignore', 'pipe', 'pipe'] },
    );
    this.child = child;
    let output = '';
    const timer = setTimeout(() => this.fail('The game did not start in time.'), PREVIEW_START_MS);
    const read = (chunk: Buffer) => {
      output = `${output}${chunk.toString('utf8').replace(ANSI, '')}`.slice(-4000);
      const url = LOCAL_URL.exec(output)?.[1];
      if (url && this.state.status === 'starting') {
        clearTimeout(timer);
        this.set({ status: 'ready', url, error: null });
      }
    };
    child.stdout?.on('data', read);
    child.stderr?.on('data', read);
    child.on('exit', () => {
      clearTimeout(timer);
      if (!this.stopped && this.state.status !== 'failed') {
        this.fail(output.trim().split('\n').at(-1) || 'The game server stopped.');
      }
    });
  }

  private set(state: PreviewState): void {
    this.state = state;
    this.onChange(state);
  }

  private fail(error: string): void {
    this.child?.kill();
    this.set({ status: 'failed', url: null, error });
  }

  stop(): void {
    this.stopped = true;
    this.child?.kill();
    this.child = null;
  }
}
