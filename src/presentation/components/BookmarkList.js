import { LitElement, html } from 'lit';
import styles from './BookmarkList.css' with { type: 'css' };
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';
import { BookmarksController } from '../controllers/BookmarksController.js';
import './BookmarkItem.js';

/**
 * A component that displays a list of bookmarks.
 * Uses BookmarksController to fetch and manage data.
 */
export class BookmarkList extends LitElement {
  static styles = [typescaleStyles, styles];

  static properties = {
    /** @type {string} */
    searchQuery: { type: String }
  };

  /** @type {BookmarksController} */
  #bookmarks = new BookmarksController(this);

  render() {
    return this.#bookmarks.render({
      initial: () => html`<p class="md-typescale-body-medium">Loading bookmarks...</p>`,
      pending: () => html`<p class="md-typescale-body-medium">Loading bookmarks...</p>`,
      complete: (bookmarks) => html`
        <div class="list">
          ${bookmarks.length === 0 
            ? html`<p class="md-typescale-body-medium">No bookmarks found.</p>` 
            : bookmarks.map(b => html`<bookmark-item .bookmark=${b}></bookmark-item>`)}
        </div>
      `,
      error: (e) => html`<p class="md-typescale-body-medium" style="color: var(--md-sys-color-error)">Error loading bookmarks: ${e.message}</p>`
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
