import { LitElement, html, css } from 'lit';
import '../components/AddBookmarkForm.js';
import '../components/BookmarkList.js';

/**
 * Component for the Dashboard page.
 */
export class BookmarkDashboard extends LitElement {
  render() {
    return html`
      <h2>Dashboard</h2>
      <bookmark-list></bookmark-list>
    `;
  }
}

customElements.define('bookmark-dashboard', BookmarkDashboard);

/**
 * Component for the Add Bookmark page.
 */
export class AddBookmarkPage extends LitElement {
  render() {
    return html`
      <h2>Add Bookmark</h2>
      <add-bookmark-form @bookmark-added=${this.#handleAdded}></add-bookmark-form>
    `;
  }

  #handleAdded() {
    // Navigate back to dashboard
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

customElements.define('add-bookmark-page', AddBookmarkPage);
