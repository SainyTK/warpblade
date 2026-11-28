const noop = (): void => {};

const inert: object = new Proxy(() => {}, {
  get: (_target, key) => {
    if (key === Symbol.toPrimitive) {
      return () => 0;
    }
    return key === "then" ? undefined : inert;
  },
  apply: () => inert,
  construct: () => inert,
});

function memoryStorage(): object {
  const items = new Map<string, string>();
  return {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => items.set(key, value),
    removeItem: (key: string) => items.delete(key),
    clear: () => items.clear(),
    key: () => null,
    length: 0,
  };
}

export function installBrowserStubs(): void {
  const scope = globalThis as unknown as Record<string, unknown>;
  const storage = memoryStorage();
  Object.assign(scope, {
    matchMedia: () => ({ matches: false, addEventListener: noop, removeEventListener: noop, addListener: noop }),
    localStorage: storage,
    sessionStorage: storage,
    document: inert,
    window: scope,
    addEventListener: noop,
    removeEventListener: noop,
    requestAnimationFrame: noop,
    AudioContext: inert,
    Image: inert,
    OffscreenCanvas: inert,
    HTMLCanvasElement: inert,
    ImageData: inert,
    location: { search: "", hash: "", href: "http://localhost/", pathname: "/" },
  });
}
