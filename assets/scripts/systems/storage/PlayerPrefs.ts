/**
 * Simple wrapper around localStorage-style API for player prefs.
 */
export class PlayerPrefs {
  getString(key: string, defaultValue = ''): string {
    const val = localStorage.getItem(key);
    return val ?? defaultValue;
  }

  setString(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getNumber(key: string, defaultValue = 0): number {
    const val = localStorage.getItem(key);
    const num = val != null ? Number(val) : NaN;
    return Number.isFinite(num) ? num : defaultValue;
  }

  setNumber(key: string, value: number): void {
    localStorage.setItem(key, String(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
