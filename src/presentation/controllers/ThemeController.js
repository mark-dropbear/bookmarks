/**
 * Reactive controller for managing application theme.
 * Handles the application of the theme to the DOM and synchronization with Use Cases.
 */
export class ThemeController {
  /** @type {string} */
  #currentTheme;
  #getThemeUseCase;

  #setThemeUseCase;
  #themeRepository;
  #themeStyles;
  #unsubscribe;

  /**
   * @param {import('lit').ReactiveElement} host 
   * @param {Object} dependencies
   * @param {import('../../domain/usecases/GetThemeUseCase.js').GetThemeUseCase} dependencies.getThemeUseCase
   * @param {import('../../domain/usecases/SetThemeUseCase.js').SetThemeUseCase} dependencies.setThemeUseCase
   * @param {import('../../domain/repositories/ThemeRepository.js').ThemeRepository} dependencies.themeRepository
   * @param {CSSStyleSheet} dependencies.themeStyles
   */
  constructor(host, { getThemeUseCase, setThemeUseCase, themeRepository, themeStyles }) {
    this.host = host;
    this.#getThemeUseCase = getThemeUseCase;
    this.#setThemeUseCase = setThemeUseCase;
    this.#themeRepository = themeRepository;
    this.#themeStyles = themeStyles;
    
    host.addController(this);
  }

  hostConnected() {
    this.#currentTheme = this.#getThemeUseCase.execute();
    this.#applyTheme(this.#currentTheme);
    
    // Adopt theme styles to the document globally using modern API
    if (this.#themeStyles) {
      const stylesToAdopt = Array.isArray(this.#themeStyles) ? this.#themeStyles : [this.#themeStyles];
      const currentAdopted = document.adoptedStyleSheets;
      
      const newAdopted = [...currentAdopted];
      let changed = false;
      
      for (const sheet of stylesToAdopt) {
        if (!newAdopted.includes(sheet)) {
          newAdopted.push(sheet);
          changed = true;
        }
      }
      
      if (changed) {
        document.adoptedStyleSheets = newAdopted;
      }
    }

    // Listen for system changes to keep 'auto' fresh
    this.#unsubscribe = this.#themeRepository.onSystemThemeChange(() => {
      if (this.#currentTheme === 'auto') {
        this.#applyTheme('auto');
      }
    });
  }

  hostDisconnected() {
    if (this.#unsubscribe) this.#unsubscribe();
  }

  get theme() {
    return this.#currentTheme;
  }

  /**
   * Updates the theme preference.
   * @param {string} newTheme 
   */
  setTheme(newTheme) {
    this.#currentTheme = newTheme;
    this.#setThemeUseCase.execute(newTheme);
    this.#applyTheme(newTheme);
    this.host.requestUpdate();
  }

  #applyTheme(theme) {
    if (theme === 'auto') {
      document.documentElement.removeAttribute('data-theme');
      this.host.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
      this.host.setAttribute('data-theme', theme);
    }
  }
}
