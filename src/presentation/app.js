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
import './components/AppSnackbar.js';

/**
 * The main application shell component.
 * Handles top-level routing, dependency injection, and global layout.
 */
export class BookmarksApp extends LitElement {
  static styles = [typescaleStyles, themeStyles, styles];

  /** @type {import('../core/DependencyRegistry.js').DependencyRegistry} */
  #dependencies;
  
  /** @type {ThemeController} */
  #themeController;
  /** @type {ContextProvider} */
  #_bookmarkRepoProvider;
  /** @type {ContextProvider} */
  #_topicRepoProvider;
  /** @type {ContextProvider} */
  #_addBookmarkProvider;
  /** @type {ContextProvider} */
  #_deleteBookmarkProvider;
  /** @type {ContextProvider} */
  #_updateBookmarkProvider;
  /** @type {ContextProvider} */
  #_getBookmarksProvider;
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

  set dependencies(registry) {
    this.#dependencies = registry;
    this.#initialize();
  }

  get dependencies() {
    return this.#dependencies;
  }

  #initialize() {
    if (!this.#dependencies) return;

    // Initialize Controllers
    this.#themeController = new ThemeController(this, {
      getThemeUseCase: this.#dependencies.getThemeUseCase,
      setThemeUseCase: this.#dependencies.setThemeUseCase,
      themeRepository: this.#dependencies.themeRepository,
      themeStyles: [themeStyles, typescaleStyles.styleSheet]
    });

    // Provide Contexts
    this.#_bookmarkRepoProvider = new ContextProvider(this, {
      context: bookmarkRepositoryContext,
      initialValue: this.#dependencies.bookmarkRepository
    });

    this.#_topicRepoProvider = new ContextProvider(this, {
      context: topicRepositoryContext,
      initialValue: this.#dependencies.topicRepository
    });

    this.#_addBookmarkProvider = new ContextProvider(this, {
      context: addBookmarkContext,
      initialValue: this.#dependencies.addBookmarkUseCase
    });

    this.#_deleteBookmarkProvider = new ContextProvider(this, {
      context: deleteBookmarkContext,
      initialValue: this.#dependencies.deleteBookmarkUseCase
    });

    this.#_updateBookmarkProvider = new ContextProvider(this, {
      context: updateBookmarkContext,
      initialValue: this.#dependencies.updateBookmarkUseCase
    });

    this.#_getBookmarksProvider = new ContextProvider(this, {
      context: getBookmarksContext,
      initialValue: this.#dependencies.getBookmarksUseCase
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

    this.requestUpdate();
  }

  render() {
    if (!this.#dependencies) return html`<div>Loading...</div>`;

    return html`
      <div @show-snackbar=${this.#handleShowSnackbar}>
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
        <app-snackbar></app-snackbar>
      </div>
    `;
  }

  /**
   * @param {CustomEvent} e 
   */
  #handleShowSnackbar(e) {
    const snackbar = this.shadowRoot.querySelector('app-snackbar');
    if (snackbar) {
      snackbar.show(e.detail.message);
    }
  }
}

customElements.define('bookmarks-app', BookmarksApp);
