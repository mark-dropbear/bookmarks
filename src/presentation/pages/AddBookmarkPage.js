import { LitElement, html } from 'lit';
import styles from './AddBookmarkPage.css' with { type: 'css' };
import '../components/AddBookmarkForm.js';

/**
 * Page component for adding a new bookmark.
 */
export class AddBookmarkPage extends LitElement {
  static styles = styles;

  render() {
    return html`
      <h2>Add Bookmark</h2>
      <add-bookmark-form @bookmark-added=${this.#handleAdded}></add-bookmark-form>
    `;
  }

  /**
   * Handles the bookmark-added event and navigates back to the dashboard.
   */
  #handleAdded() {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

customElements.define('add-bookmark-page', AddBookmarkPage);
