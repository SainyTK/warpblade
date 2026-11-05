/**
 * Runs the game's own Vite through its JavaScript API, so the harness can switch off hot reload without touching the
 * game's config: other agents edit the game while a command runs, and a reload would wipe the page mid-run.
 * Arguments: the URL of Vite's module, the game root, the port and the host.
 */
export const VITE_LAUNCHER = `
const [viteUrl, root, port, host] = process.argv.slice(1);
const { createServer } = await import(viteUrl);
const server = await createServer({
  root,
  clearScreen: false,
  logLevel: "warn",
  server: { port: Number(port), strictPort: true, host, hmr: false },
});
await server.listen();
const stop = async () => {
  await server.close();
  process.exit(0);
};
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
`;
