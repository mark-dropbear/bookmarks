/**
 * @typedef {Object} Dependencies
 * @property {import('../domain/repositories/BookmarkRepository.js').BookmarkRepository} bookmarkRepository
 * @property {import('../domain/repositories/TopicRepository.js').TopicRepository} topicRepository
 * @property {import('../domain/repositories/ThemeRepository.js').ThemeRepository} themeRepository
 * @property {import('../domain/usecases/AddBookmarkUseCase.js').AddBookmarkUseCase} addBookmarkUseCase
 * @property {import('../domain/usecases/DeleteBookmarkUseCase.js').DeleteBookmarkUseCase} deleteBookmarkUseCase
 * @property {import('../domain/usecases/UpdateBookmarkUseCase.js').UpdateBookmarkUseCase} updateBookmarkUseCase
 * @property {import('../domain/usecases/GetBookmarksUseCase.js').GetBookmarksUseCase} getBookmarksUseCase
 * @property {import('../domain/usecases/GetThemeUseCase.js').GetThemeUseCase} getThemeUseCase
 * @property {import('../domain/usecases/SetThemeUseCase.js').SetThemeUseCase} setThemeUseCase
 */

/**
 * A central registry for all application dependencies.
 * This class facilitates clean separation of concerns by acting as a container
 * for repositories, use cases, and other essential services.
 */
export class DependencyRegistry {
  /** @type {import('../domain/repositories/BookmarkRepository.js').BookmarkRepository} */
  #bookmarkRepository;
  /** @type {import('../domain/repositories/TopicRepository.js').TopicRepository} */
  #topicRepository;
  /** @type {import('../domain/repositories/ThemeRepository.js').ThemeRepository} */
  #themeRepository;
  /** @type {import('../domain/usecases/AddBookmarkUseCase.js').AddBookmarkUseCase} */
  #addBookmarkUseCase;
  /** @type {import('../domain/usecases/DeleteBookmarkUseCase.js').DeleteBookmarkUseCase} */
  #deleteBookmarkUseCase;
  /** @type {import('../domain/usecases/UpdateBookmarkUseCase.js').UpdateBookmarkUseCase} */
  #updateBookmarkUseCase;
  /** @type {import('../domain/usecases/GetBookmarksUseCase.js').GetBookmarksUseCase} */
  #getBookmarksUseCase;
  /** @type {import('../domain/usecases/GetThemeUseCase.js').GetThemeUseCase} */
  #getThemeUseCase;
  /** @type {import('../domain/usecases/SetThemeUseCase.js').SetThemeUseCase} */
  #setThemeUseCase;

  /**
   * @param {Dependencies} deps - The initial set of dependencies.
   */
  constructor(deps) {
    this.#bookmarkRepository = deps.bookmarkRepository;
    this.#topicRepository = deps.topicRepository;
    this.#themeRepository = deps.themeRepository;
    this.#addBookmarkUseCase = deps.addBookmarkUseCase;
    this.#deleteBookmarkUseCase = deps.deleteBookmarkUseCase;
    this.#updateBookmarkUseCase = deps.updateBookmarkUseCase;
    this.#getBookmarksUseCase = deps.getBookmarksUseCase;
    this.#getThemeUseCase = deps.getThemeUseCase;
    this.#setThemeUseCase = deps.setThemeUseCase;
  }

  get bookmarkRepository() { return this.#bookmarkRepository; }
  get topicRepository() { return this.#topicRepository; }
  get themeRepository() { return this.#themeRepository; }
  get addBookmarkUseCase() { return this.#addBookmarkUseCase; }
  get deleteBookmarkUseCase() { return this.#deleteBookmarkUseCase; }
  get updateBookmarkUseCase() { return this.#updateBookmarkUseCase; }
  get getBookmarksUseCase() { return this.#getBookmarksUseCase; }
  get getThemeUseCase() { return this.#getThemeUseCase; }
  get setThemeUseCase() { return this.#setThemeUseCase; }
}
