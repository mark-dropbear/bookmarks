import { LitElement, html, css } from 'lit';
import '../components/AddBookmarkForm.js';

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
    // Optionally navigate back to dashboard
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

customElements.define('add-bookmark-page', AddBookmarkPage);
