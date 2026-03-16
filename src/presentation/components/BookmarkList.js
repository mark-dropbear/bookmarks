import { LitElement, html } from 'lit';
import styles from './BookmarkList.css' with { type: 'css' };
import { BookmarksController } from '../controllers/BookmarksController.js';
import './BookmarkItem.js';

/**
 * A component that displays a list of bookmarks.
 * Uses BookmarksController to fetch and manage data.
 */
export class BookmarkList extends LitElement {
  static styles = styles;

  static properties = {
    /** @type {string} */
    searchQuery: { type: String }
  };

  /** @type {BookmarksController} */
  #bookmarks = new BookmarksController(this);

  render() {
    return this.#bookmarks.render({
      initial: () => html`<p>Loading bookmarks...</p>`,
      pending: () => html`<p>Loading bookmarks...</p>`,
      complete: (bookmarks) => html`
        <div class="list">
          ${bookmarks.length === 0 
            ? html`<p>No bookmarks found.</p>` 
            : bookmarks.map(b => html`<bookmark-item .bookmark=${b}></bookmark-item>`)}
        </div>
      `,
      error: (e) => html`<p style="color: red">Error loading bookmarks: ${e.message}</p>`
    });
  }

  /**
   * Refreshes the bookmark list.
   */
  refresh() {
    this.#bookmarks.refresh();
  }
}

customElements.define('bookmark-list', BookmarkList);
