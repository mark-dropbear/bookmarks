/**
 * Browser-based implementation of ThemeRepository.
 * Uses localStorage for persistence and matchMedia for system preference detection.
 * @implements {import('../../domain/repositories/ThemeRepository.js').ThemeRepository}
 */
export class BrowserThemeRepository {
  #storageKey = 'theme-preference';
  #darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  #contrastQuery = window.matchMedia('(prefers-contrast: more)');

  /**
   * @returns {string} The saved preference or 'auto'.
   */
  getTheme() {
    return localStorage.getItem(this.#storageKey) || 'auto';
  }

  /**
   * @param {string} theme 
   */
  setTheme(theme) {
    if (theme === 'auto') {
      localStorage.removeItem(this.#storageKey);
    } else {
      localStorage.setItem(this.#storageKey, theme);
    }
  }

  /**
   * Listens for changes in both color scheme and contrast preferences.
   * @param {function(): void} callback 
   * @returns {function(): void} Unsubscribe function.
   */
  onSystemThemeChange(callback) {
    this.#darkQuery.addEventListener('change', callback);
    this.#contrastQuery.addEventListener('change', callback);
    
    return () => {
      this.#darkQuery.removeEventListener('change', callback);
      this.#contrastQuery.removeEventListener('change', callback);
    };
  }
}
