import { LitElement, html } from 'lit';
import styles from './BookmarkDashboard.css' with { type: 'css' };
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';
import { ContextConsumer } from '@lit/context';
import { deleteBookmarkContext } from '../context.js';
import '../components/BookmarkList.js';
import '../components/EditBookmarkDialog.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';

/**
 * The primary dashboard page.
 * Displays the list of bookmarks and provides a real-time search interface.
 */
export class BookmarkDashboard extends LitElement {
  static styles = [typescaleStyles, styles];

  static properties = {
    /** @type {string} */
    _searchQuery: { state: true },
    /** @type {string|null} */
    _deleteId: { state: true },
    /** @type {Object|null} */
    _editBookmark: { state: true }
  };

  /** @type {ContextConsumer<import('../context.js').deleteBookmarkContext>} */
  #deleteBookmarkUseCase = new ContextConsumer(this, {
    context: deleteBookmarkContext,
    subscribe: true,
  });

  constructor() {
    super();
    this._searchQuery = '';
    this._deleteId = null;
    this._editBookmark = null;
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
      
      <bookmark-list 
        .searchQuery=${this._searchQuery}
        @delete-bookmark=${this.#handleDelete}
        @edit-bookmark=${this.#handleEdit}
      ></bookmark-list>

      <edit-bookmark-dialog
        .bookmark=${this._editBookmark}
        @bookmark-updated=${this.#handleUpdated}
        @closed=${() => this._editBookmark = null}
      ></edit-bookmark-dialog>

      <md-dialog 
        id="delete-dialog"
        type="alert"
        ?open=${!!this._deleteId}
        @closed=${() => this._deleteId = null}
      >
        <div slot="headline">Delete Bookmark?</div>
        <form slot="content" id="delete-form" method="dialog">
          <div class="md-typescale-body-medium">
            Are you sure you want to delete this bookmark? This action cannot be undone.
          </div>
        </form>
        <div slot="actions">
          <md-text-button form="delete-form" value="cancel">Cancel</md-text-button>
          <md-text-button form="delete-form" value="delete" @click=${this.#confirmDelete}>Delete</md-text-button>
        </div>
      </md-dialog>
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

  /**
   * Triggers the deletion confirmation dialog.
   * @param {CustomEvent} e 
   */
  #handleDelete(e) {
    this._deleteId = e.detail.id;
  }

  /**
   * Triggers the edit bookmark dialog.
   * @param {CustomEvent} e 
   */
  #handleEdit(e) {
    this._editBookmark = e.detail.bookmark;
  }

  /**
   * Handles successful bookmark update.
   */
  #handleUpdated() {
    this._editBookmark = null;
    this.#refreshList();
    // TODO: Show success snackbar
  }

  /**
   * Executes the deletion after confirmation.
   */
  async #confirmDelete() {
    if (!this._deleteId) return;

    try {
      await this.#deleteBookmarkUseCase.value.execute(this._deleteId);
      this._deleteId = null;
      this.#refreshList();
      // TODO: Show success snackbar
    } catch (err) {
      console.error('Failed to delete bookmark:', err);
      alert('Failed to delete bookmark. Please try again.');
    }
  }

  #refreshList() {
    const list = this.shadowRoot.querySelector('bookmark-list');
    if (list) {
      list.refresh();
    }
  }
}

customElements.define('bookmark-dashboard', BookmarkDashboard);
