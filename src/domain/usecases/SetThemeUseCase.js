/**
 * Use case for updating the theme preference.
 */
export class SetThemeUseCase {
  /**
   * @param {import('../repositories/ThemeRepository.js').ThemeRepository} repository
   */
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * @param {string} theme - The new theme identifier.
   */
  execute(theme) {
    this.repository.setTheme(theme);
  }
}
