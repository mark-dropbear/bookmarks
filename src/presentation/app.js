import { LitElement, html } from 'lit';
import styles from './app.css' with { type: 'css' };
import themeStyles from './theme.css' with { type: 'css' };
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';
import { Router } from '@lit-labs/router';
import { ContextProvider } from '@lit/context';

// Material Web Imports
import '@material/web/button/filled-button.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';

// Internal Imports
import { InMemoryBookmarkRepository } from '../data/repositories/InMemoryBookmarkRepository.js';
import { InMemoryTopicRepository } from '../data/repositories/InMemoryTopicRepository.js';
import { BrowserThemeRepository } from '../data/repositories/BrowserThemeRepository.js';
import { AddBookmarkUseCase } from '../domain/usecases/AddBookmarkUseCase.js';
import { DeleteBookmarkUseCase } from '../domain/usecases/DeleteBookmarkUseCase.js';
import { UpdateBookmarkUseCase } from '../domain/usecases/UpdateBookmarkUseCase.js';
import { GetBookmarksUseCase } from '../domain/usecases/GetBookmarksUseCase.js';
import { GetThemeUseCase } from '../domain/usecases/GetThemeUseCase.js';
import { SetThemeUseCase } from '../domain/usecases/SetThemeUseCase.js';
import { ThemeController } from './controllers/ThemeController.js';
import { 
  bookmarkRepositoryContext, 
  topicRepositoryContext, 
  addBookmarkContext, 
  deleteBookmarkContext,
  updateBookmarkContext,
  getBookmarksContext 
} from './context.js';

// Page imports
import './pages/BookmarkDashboard.js';
import './pages/AddBookmarkPage.js';

/**
 * The main application shell component.
 * Handles top-level routing, dependency injection, and global layout.
 */
export class BookmarksApp extends LitElement {
  static styles = [typescaleStyles, themeStyles, styles];

  // Private state using # fields
  /** @type {import('../domain/repositories/BookmarkRepository.js').BookmarkRepository} */
  #bookmarkRepo;
  /** @type {import('../domain/repositories/TopicRepository.js').TopicRepository} */
  #topicRepo;
  /** @type {import('../domain/repositories/ThemeRepository.js').ThemeRepository} */
  #themeRepo;
  /** @type {AddBookmarkUseCase} */
  #addBookmarkUseCase;
  /** @type {DeleteBookmarkUseCase} */
  #deleteBookmarkUseCase;
  /** @type {UpdateBookmarkUseCase} */
  #updateBookmarkUseCase;
  /** @type {GetBookmarksUseCase} */
  #getBookmarksUseCase;
  /** @type {GetThemeUseCase} */
  #getThemeUseCase;
  /** @type {SetThemeUseCase} */
  #setThemeUseCase;
  /** @type {ThemeController} */
  #themeController;
  /** @type {ContextProvider} */
  #bookmarkRepoProvider;
  /** @type {ContextProvider} */
  #topicRepoProvider;
  /** @type {ContextProvider} */
  #addBookmarkProvider;
  /** @type {ContextProvider} */
  #deleteBookmarkProvider;
  /** @type {ContextProvider} */
  #updateBookmarkProvider;
  /** @type {ContextProvider} */
  #getBookmarksProvider;
  /** @type {Router} */
  #router;

  /** @type {Array<{value: string, label: string}>} */
  #themes = [
    { value: 'auto', label: 'System Default' },
    { value: 'light', label: 'Light' },
    { value: 'light-medium-contrast', label: 'Light (Medium)' },
    { value: 'light-high-contrast', label: 'Light (High)' },
    { value: 'dark', label: 'Dark' },
    { value: 'dark-medium-contrast', label: 'Dark (Medium)' },
    { value: 'dark-high-contrast', label: 'Dark (High)' }
  ];

  constructor() {
    super();
    // Initialize Repositories
    this.#bookmarkRepo = new InMemoryBookmarkRepository();
    this.#topicRepo = new InMemoryTopicRepository();
    this.#themeRepo = new BrowserThemeRepository();

    // Initialize Use Cases
    this.#addBookmarkUseCase = new AddBookmarkUseCase(this.#bookmarkRepo, this.#topicRepo);
    this.#deleteBookmarkUseCase = new DeleteBookmarkUseCase(this.#bookmarkRepo, this.#topicRepo);
    this.#updateBookmarkUseCase = new UpdateBookmarkUseCase(this.#bookmarkRepo, this.#topicRepo);
    this.#getBookmarksUseCase = new GetBookmarksUseCase(this.#bookmarkRepo);
    this.#getThemeUseCase = new GetThemeUseCase(this.#themeRepo);
    this.#setThemeUseCase = new SetThemeUseCase(this.#themeRepo);

    // Initialize Controllers
    this.#themeController = new ThemeController(this, {
      getThemeUseCase: this.#getThemeUseCase,
      setThemeUseCase: this.#setThemeUseCase,
      themeRepository: this.#themeRepo,
      themeStyles: [themeStyles, typescaleStyles.styleSheet]
    });

    // Provide Contexts
    this.#bookmarkRepoProvider = new ContextProvider(this, {
      context: bookmarkRepositoryContext,
      initialValue: this.#bookmarkRepo
    });

    this.#topicRepoProvider = new ContextProvider(this, {
      context: topicRepositoryContext,
      initialValue: this.#topicRepo
    });

    this.#addBookmarkProvider = new ContextProvider(this, {
      context: addBookmarkContext,
      initialValue: this.#addBookmarkUseCase
    });

    this.#deleteBookmarkProvider = new ContextProvider(this, {
      context: deleteBookmarkContext,
      initialValue: this.#deleteBookmarkUseCase
    });

    this.#updateBookmarkProvider = new ContextProvider(this, {
      context: updateBookmarkContext,
      initialValue: this.#updateBookmarkUseCase
    });

    this.#getBookmarksProvider = new ContextProvider(this, {
      context: getBookmarksContext,
      initialValue: this.#getBookmarksUseCase
    });

    // Setup Router
    this.#router = new Router(this, [
      { 
        path: '/', 
        render: () => html`<bookmark-dashboard></bookmark-dashboard>` 
      },
      { 
        path: '/add', 
        render: () => html`<add-bookmark-page .router=${this.#router}></add-bookmark-page>` 
      }
    ]);
  }

  render() {
    return html`
      <header>
        <h1 class="md-typescale-headline-large">Bookmarks</h1>
        <div class="controls">
          <md-outlined-select 
            label="Theme"
            @change=${(e) => this.#themeController.setTheme(e.target.value)} 
            .value=${this.#themeController.theme}
          >
            ${this.#themes.map(t => html`
              <md-select-option value=${t.value}>
                <div slot="headline">${t.label}</div>
              </md-select-option>
            `)}
          </md-outlined-select>
          <nav>
            <md-filled-button @click=${() => this.#router.goto('/')}>Dashboard</md-filled-button>
            <md-filled-button @click=${() => this.#router.goto('/add')}>Add New</md-filled-button>
          </nav>
        </div>
      </header>
      <main>
        ${this.#router.outlet()}
      </main>
    `;
  }
}

customElements.define('bookmarks-app', BookmarksApp);
