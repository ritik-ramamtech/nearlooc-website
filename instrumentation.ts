export async function register() {
  // Node.js 22 exposes a `localStorage` global via --localstorage-file but without
  // a valid path it has no methods (getItem, setItem, etc.), crashing any code that
  // calls localStorage.getItem before checking for a browser environment.
  // Patch it with a no-op in-memory implementation so SSR never throws.
  if (
    typeof globalThis.localStorage !== "undefined" &&
    typeof (globalThis.localStorage as Storage).getItem !== "function"
  ) {
    const store: Record<string, string> = {};
    (globalThis as { localStorage: Storage }).localStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
      key: (index: number) => Object.keys(store)[index] ?? null,
      get length() { return Object.keys(store).length; },
    };
  }
}
