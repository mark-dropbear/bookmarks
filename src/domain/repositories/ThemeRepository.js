/**
 * Interface for theme storage and retrieval operations.
 * Defines the contract for managing user theme preferences and system detection.
 * @interface ThemeRepository
 */
export class ThemeRepository {
  /**
   * Gets the currently saved theme preference.
   * @returns {string} The theme identifier (e.g., 'light', 'dark', 'auto').
   */
  getTheme() {
    throw new Error('Not implemented');
  }

  /**
   * Persists the user's theme preference.
   * @param {string} theme - The theme identifier.
   */
  setTheme(theme) {
    throw new Error('Not implemented');
  }

  /**
   * Subscribes to system-level theme changes (e.g. OS dark mode toggle).
   * @param {function(string): void} callback - Called when the system theme changes.
   * @returns {function(): void} An unsubscribe function.
   */
  onSystemThemeChange(callback) {
    throw new Error('Not implemented');
  }
}
