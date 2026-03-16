import { LitElement, html } from 'lit';
import styles from './BookmarkDashboard.css' with { type: 'css' };
import '../components/BookmarkList.js';
import '@material/web/textfield/outlined-text-field.js';

/**
 * The primary dashboard page.
 * Displays the list of bookmarks and provides a real-time search interface.
 */
export class BookmarkDashboard extends LitElement {
  static styles = styles;

  static properties = {
    /** @type {string} */
    _searchQuery: { state: true }
  };

  constructor() {
    super();
    this._searchQuery = '';
  }

  render() {
    return html`
      <div class="search-container">
        <md-outlined-text-field
          label="Search bookmarks..."
          placeholder="Type to filter by title, URL, or tags"
          .value=${this._searchQuery}
          @input=${this.#handleSearch}
        ></md-outlined-text-field>
      </div>
      <bookmark-list .searchQuery=${this._searchQuery}></bookmark-list>
    `;
  }

  /**
   * Handles the search input event and updates the internal state.
   * @param {InputEvent} e 
   */
  #handleSearch(e) {
    const target = /** @type {HTMLInputElement} */ (e.target);
    this._searchQuery = target.value;
  }
}

customElements.define('bookmark-dashboard', BookmarkDashboard);
