import { configuration } from './config';
import { studioServer } from './http/server';
import { DraftStore } from './services/drafts';

const config = configuration();
const server = studioServer(new DraftStore(config.studioRoot, config.repoRoot), config.origins);
server.listen(config.port, '127.0.0.1', () => {
  console.log(`Studio server on http://127.0.0.1:${config.port}`);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    server.close();
    process.exit(0);
  });
}
