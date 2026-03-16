import { LitElement, html, css } from 'lit';

/**
 * Placeholder component for the Dashboard page.
 */
export class BookmarkDashboard extends LitElement {
  render() {
    return html`<h2>Dashboard</h2><p>List of bookmarks will go here.</p>`;
  }
}

customElements.define('bookmark-dashboard', BookmarkDashboard);

/**
 * Placeholder component for the Add Bookmark page.
 */
export class AddBookmarkPage extends LitElement {
  render() {
    return html`<h2>Add Bookmark</h2><p>Form will go here.</p>`;
  }
}

customElements.define('add-bookmark-page', AddBookmarkPage);
