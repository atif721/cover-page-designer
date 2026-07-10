// Thin localStorage helpers. Reads return the parsed JSON or `null`
// when the key is missing, the JSON is malformed, or validation fails.
// Writes silently swallow quota / private-mode errors — matching the
// behaviour of the previous App.tsx (lines 108-112).
//
// Note: this is not a generic `useLocalStorage` hook because the app
// reads exactly once at mount and writes on every change. Forcing
// the React-state-of-the-value shape would be the wrong abstraction.

export function loadFromStorage(
  key: string,
  validate: (raw: unknown) => boolean,
): unknown {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!validate(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota / private-mode — silently ignore
  }
}
