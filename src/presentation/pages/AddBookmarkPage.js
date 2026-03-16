import { LitElement, html } from 'lit';
import styles from './AddBookmarkPage.css' with { type: 'css' };
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';
import '../components/AddBookmarkForm.js';

/**
 * Page component for adding a new bookmark.
 */
export class AddBookmarkPage extends LitElement {
  static styles = [typescaleStyles, styles];

  static properties = {
    /** @type {import('@lit-labs/router').Router} */
    router: { type: Object }
  };

  render() {
    return html`
      <h2 class="md-typescale-headline-medium">Add Bookmark</h2>
      <add-bookmark-form @bookmark-added=${this.#handleAdded}></add-bookmark-form>
    `;
  }

  /**
   * Handles the bookmark-added event and navigates back to the dashboard.
   */
  #handleAdded() {
    if (this.router) {
      this.router.goto('/');
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }
}

customElements.define('add-bookmark-page', AddBookmarkPage);
