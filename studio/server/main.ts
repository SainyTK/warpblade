import { configuration } from './config';
import { studioServer } from './http/server';
import { JobStore } from './services/jobStore';
import { JobService } from './services/jobs';
import { ProxyService } from './services/proxy';
import { SketchStore } from './services/sketches';
import { WorktreeService } from './services/worktrees';

const config = configuration();
const jobs = new JobService(
  config,
  new JobStore(config.dataDir),
  new WorktreeService(config),
  new ProxyService(config.proxyUrl, config.proxyKeyFile),
);
await jobs.load();
const server = studioServer({ jobs, sketches: new SketchStore(config.dataDir) }, config.origins);
server.listen(config.port, '127.0.0.1', () => {
  console.log(`Studio server on http://127.0.0.1:${config.port}`);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    jobs.closeAll();
    server.close();
    process.exit(0);
  });
}
