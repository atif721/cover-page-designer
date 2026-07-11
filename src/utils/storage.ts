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
    console.log("error");
  }
}
