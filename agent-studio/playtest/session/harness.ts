import type { Browser, Page } from "playwright-core";
import { launchBrowser } from "../services/browser";
import { type DevServer, startDevServer } from "../services/devServer";
import type { Session, SessionOptions } from "../types/session";
import { createSession } from "./createSession";

/** One dev server and one browser, for as many fresh sessions as a command needs. */
export interface Harness {
  url(): string;
  newSession(options?: SessionOptions): Promise<Session>;
  /** a page in its own context with real time, for pages other than the game */
  newPage(): Promise<Page>;
  close(): Promise<void>;
}

export async function launchHarness(root: string): Promise<Harness> {
  let server: DevServer = await startDevServer(root);
  let browser: Browser;
  try {
    browser = await launchBrowser();
  } catch (error) {
    await server.stop();
    throw error;
  }
  return {
    url: () => server.url,
    async newSession(options) {
      try {
        return await createSession(browser, server.url, options);
      } catch (error) {
        // another agent may have changed vite.config.ts under the running server: start it again once
        console.error(`Loading the game failed (${String(error)}); restarting the dev server.`);
        await server.stop();
        server = await startDevServer(root);
        return createSession(browser, server.url, options);
      }
    },
    async newPage() {
      const context = await browser.newContext();
      return context.newPage();
    },
    async close() {
      await browser.close();
      await server.stop();
    },
  };
}
