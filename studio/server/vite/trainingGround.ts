import { createServer, type Plugin } from 'vite';
import { TRAINING_PATH } from '../../shared/ports';

export function trainingGround(repoRoot: string): Plugin {
  return {
    name: 'warpblade-training-ground',
    apply: 'serve',
    async configureServer(server) {
      const { httpServer } = server;
      if (!httpServer) {
        return;
      }
      const game = await createServer({
        root: repoRoot,
        base: TRAINING_PATH,
        server: { middlewareMode: true, ws: { server: httpServer } },
      });
      httpServer.once('close', () => {
        void game.close();
      });
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith(TRAINING_PATH)) {
          game.middlewares(req, res, next);
        } else {
          next();
        }
      });
    },
  };
}
