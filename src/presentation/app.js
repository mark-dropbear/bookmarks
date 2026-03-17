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

  static properties = {
    /** @type {import('../core/DependencyRegistry.js').DependencyRegistry} */
    dependencies: { type: Object }
  };

  /** @type {ThemeController} */
  #themeController;

  // Initialize Providers in constructor/fields so they register as controllers immediately
  #_bookmarkRepoProvider = new ContextProvider(this, { context: bookmarkRepositoryContext });
  #_topicRepoProvider = new ContextProvider(this, { context: topicRepositoryContext });
  #_addBookmarkProvider = new ContextProvider(this, { context: addBookmarkContext });
  #_deleteBookmarkProvider = new ContextProvider(this, { context: deleteBookmarkContext });
  #_updateBookmarkProvider = new ContextProvider(this, { context: updateBookmarkContext });
  #_getBookmarksProvider = new ContextProvider(this, { context: getBookmarksContext });

  /** @type {Router} */
  #router = new Router(this, [
    { 
      path: '/', 
      render: () => html`<bookmark-dashboard></bookmark-dashboard>` 
    },
    { 
      path: '/add', 
      render: () => html`<add-bookmark-page .router=${this.#router}></add-bookmark-page>` 
    }
  ]);

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

  willUpdate(changedProperties) {
    if (changedProperties.has('dependencies') && this.dependencies) {
      const deps = this.dependencies;

      // Sync provider values
      this.#_bookmarkRepoProvider.setValue(deps.bookmarkRepository);
      this.#_topicRepoProvider.setValue(deps.topicRepository);
      this.#_addBookmarkProvider.setValue(deps.addBookmarkUseCase);
      this.#_deleteBookmarkProvider.setValue(deps.deleteBookmarkUseCase);
      this.#_updateBookmarkProvider.setValue(deps.updateBookmarkUseCase);
      this.#_getBookmarksProvider.setValue(deps.getBookmarksUseCase);

      // Initialize ThemeController once dependencies are available
      if (!this.#themeController) {
        this.#themeController = new ThemeController(this, {
          getThemeUseCase: deps.getThemeUseCase,
          setThemeUseCase: deps.setThemeUseCase,
          themeRepository: deps.themeRepository,
          themeStyles: [themeStyles, typescaleStyles.styleSheet]
        });
      }
    }
  }

  render() {
    // If dependencies haven't arrived yet, show loading
    if (!this.dependencies) {
      return html`<div class="loading-overlay">Loading dependencies...</div>`;
    }

    return html`
      <div @show-snackbar=${this.#handleShowSnackbar}>
        <header>
          <h1 class="md-typescale-headline-large">Bookmarks</h1>
          <div class="controls">
            ${this.#themeController ? html`
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
            ` : ''}
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
