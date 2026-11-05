import { existsSync } from "node:fs";
import { userInfo } from "node:os";
import { join } from "node:path";
import { type Browser, chromium } from "playwright-core";
import { CHROMIUM_ENV, CHROMIUM_IN_HOME } from "../constants/browser";
import { onCleanup } from "./cleanup";

/** the user's real home: HOME can point elsewhere when an agent runs the harness */
function chromiumPath(): string {
  const path = process.env[CHROMIUM_ENV] || join(userInfo().homedir, CHROMIUM_IN_HOME);
  if (!existsSync(path)) {
    throw new Error(`No Chromium at ${path}. Set ${CHROMIUM_ENV} to a Chromium or Chrome executable.`);
  }
  return path;
}

/** a headless Chromium, closed when the command ends */
export async function launchBrowser(): Promise<Browser> {
  const browser = await chromium.launch({ executablePath: chromiumPath(), headless: true });
  const forget = onCleanup(() => browser.close());
  browser.once("disconnected", forget);
  return browser;
}
