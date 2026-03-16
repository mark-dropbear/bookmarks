import { LitElement, html } from 'lit';
import styles from './app.css' with { type: 'css' };
import { Router } from '@lit-labs/router';
import { ContextProvider } from '@lit/context';

// Material Web Imports
import '@material/web/button/filled-button.js';

// Internal Imports
import { InMemoryBookmarkRepository } from '../data/repositories/InMemoryBookmarkRepository.js';
import { InMemoryTopicRepository } from '../data/repositories/InMemoryTopicRepository.js';
import { AddBookmarkUseCase } from '../domain/usecases/AddBookmarkUseCase.js';
import { GetBookmarksUseCase } from '../domain/usecases/GetBookmarksUseCase.js';
import { 
  bookmarkRepositoryContext, 
  topicRepositoryContext, 
  addBookmarkContext, 
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
  static styles = styles;

  // Private state using # fields
  #bookmarkRepo;
  #topicRepo;
  #addBookmarkUseCase;
  #getBookmarksUseCase;
  #bookmarkRepoProvider;
  #topicRepoProvider;
  #addBookmarkProvider;
  #getBookmarksProvider;
  #router;

  constructor() {
    super();
    // Initialize Repositories
    this.#bookmarkRepo = new InMemoryBookmarkRepository();
    this.#topicRepo = new InMemoryTopicRepository();

    // Initialize Use Cases
    this.#addBookmarkUseCase = new AddBookmarkUseCase(this.#bookmarkRepo, this.#topicRepo);
    this.#getBookmarksUseCase = new GetBookmarksUseCase(this.#bookmarkRepo);

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

    this.#getBookmarksProvider = new ContextProvider(this, {
      context: getBookmarksContext,
      initialValue: this.#getBookmarksUseCase
    });

    // Setup Router
    this.#router = new Router(this, [
      { path: '/', render: () => html`<bookmark-dashboard></bookmark-dashboard>` },
      { path: '/add', render: () => html`<add-bookmark-page></add-bookmark-page>` }
    ]);
  }

  render() {
    return html`
      <header>
        <h1>Bookmarks</h1>
        <nav>
          <md-filled-button @click=${() => this.#router.goto('/')}>Dashboard</md-filled-button>
          <md-filled-button @click=${() => this.#router.goto('/add')}>Add New</md-filled-button>
        </nav>
      </header>
      <main>
        ${this.#router.outlet()}
      </main>
    `;
  }
}

customElements.define('bookmarks-app', BookmarksApp);
