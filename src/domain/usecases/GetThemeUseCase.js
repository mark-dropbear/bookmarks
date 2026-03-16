/**
 * Use case for retrieving the current theme preference.
 */
export class GetThemeUseCase {
  /**
   * @param {import('../repositories/ThemeRepository.js').ThemeRepository} repository
   */
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * @returns {string} The current theme identifier.
   */
  execute() {
    return this.repository.getTheme();
  }
}
