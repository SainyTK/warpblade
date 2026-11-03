import { readFileSync } from 'node:fs';
import type { ModelInfo } from '../../shared/api';
import { MODEL_CACHE_MS, PROXY_TIMEOUT_MS } from '../constants';
import { chatModels } from '../utils/models';

export interface ProxyStatus {
  models: ModelInfo[];
  error: string | null;
}

interface ModelList {
  data?: { id?: unknown }[];
}

/**
 * The CLIProxyAPI endpoint this server's agents use. The browser never chooses it.
 * The client key stays here and in the agent process environment; it is never returned or logged.
 */
export class ProxyService {
  private cached: { at: number; status: ProxyStatus } | null = null;

  constructor(
    readonly baseUrl: string,
    private readonly keyFile: string,
  ) {}

  /** Throws when the key file is missing, so no agent starts without the proxy. */
  key(): string {
    const key = readFileSync(this.keyFile, 'utf8').trim();
    if (!key) {
      throw new Error('The proxy client key file is empty.');
    }
    return key;
  }

  async status(force = false): Promise<ProxyStatus> {
    if (!force && this.cached && Date.now() - this.cached.at < MODEL_CACHE_MS) {
      return this.cached.status;
    }
    const status = await this.fetchStatus();
    // Failures are not cached, so the page recovers as soon as the proxy is back.
    this.cached = status.error ? null : { at: Date.now(), status };
    return status;
  }

  private async fetchStatus(): Promise<ProxyStatus> {
    let key: string;
    try {
      key = this.key();
    } catch {
      return { models: [], error: 'The proxy client key is missing on the server.' };
    }
    try {
      const response = await fetch(new URL('/v1/models', this.baseUrl), {
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(PROXY_TIMEOUT_MS),
      });
      if (response.status === 401 || response.status === 403) {
        return { models: [], error: 'The proxy refused the server key.' };
      }
      if (!response.ok) {
        return { models: [], error: `The proxy answered HTTP ${response.status}.` };
      }
      const body = (await response.json()) as ModelList;
      const ids = (body.data ?? [])
        .map((model) => model.id)
        .filter((id): id is string => typeof id === 'string');
      const models = chatModels(ids);
      return models.length
        ? { models, error: null }
        : { models, error: 'The proxy serves no chat models.' };
    } catch {
      return { models: [], error: 'The agent proxy is not reachable.' };
    }
  }
}
