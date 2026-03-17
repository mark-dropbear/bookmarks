import { LitElement, html } from 'lit';
import styles from './EditBookmarkDialog.css' with { type: 'css' };
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';
import { ContextConsumer } from '@lit/context';
import { updateBookmarkContext } from '../context.js';
import { AppError } from '../../core/errors/AppErrors.js';

import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';
import '@material/web/textfield/outlined-text-field.js';

/**
 * A dialog component for editing existing bookmarks.
 */
export class EditBookmarkDialog extends LitElement {
  static styles = [typescaleStyles, styles];

  static properties = {
    /** @type {import('../../domain/entities/Bookmark.js').Bookmark|null} */
    bookmark: { type: Object },
    /** @type {string|null} */
    _error: { state: true }
  };

  /** @type {ContextConsumer<import('../context.js').updateBookmarkContext>} */
  #updateBookmarkUseCase = new ContextConsumer(this, {
    context: updateBookmarkContext,
    subscribe: true,
  });

  constructor() {
    super();
    this.bookmark = null;
    this._error = null;
  }

  render() {
    if (!this.bookmark) return html``;

    return html`
      <md-dialog 
        id="edit-dialog"
        ?open=${!!this.bookmark}
        @closed=${this.#handleClosed}
      >
        <div slot="headline">Edit Bookmark</div>
        <form slot="content" id="edit-form" method="dialog" @submit=${this.#handleSubmit}>
          ${this._error ? html`<div class="error-message md-typescale-body-medium">${this._error}</div>` : ''}
          
          <md-outlined-text-field 
            label="Title" 
            name="name" 
            .value=${this.bookmark.name()} 
            required
          ></md-outlined-text-field>
          
          <md-outlined-text-field 
            label="URL" 
            name="url" 
            type="url" 
            .value=${this.bookmark.url()} 
            required
          ></md-outlined-text-field>
          
          <md-outlined-text-field 
            label="Description" 
            name="description" 
            .value=${this.bookmark.description()}
          ></md-outlined-text-field>
          
          <md-outlined-text-field 
            label="Topics (comma separated)" 
            name="topics" 
            .value=${this.bookmark.about().map(t => t.name).join(', ')}
          ></md-outlined-text-field>
        </form>
        <div slot="actions">
          <md-text-button form="edit-form" value="cancel">Cancel</md-text-button>
          <md-text-button form="edit-form" value="save" @click=${this.#handleSubmit}>Save</md-text-button>
        </div>
      </md-dialog>
    `;
  }

  #handleClosed() {
    this.bookmark = null;
    this._error = null;
    this.dispatchEvent(new CustomEvent('closed', { bubbles: true, composed: true }));
  }

  /**
   * Handles the form submission.
   * @param {SubmitEvent} e 
   */
  async #handleSubmit(e) {
    e.preventDefault();
    
    // If user clicked cancel (via form[method="dialog"]), just let it close
    if (e.submitter && e.submitter.value === 'cancel') {
      return;
    }

    this._error = null;
    
    const form = this.shadowRoot.querySelector('#edit-form');
    const formData = new FormData(form);
    
    const data = {
      id: this.bookmark.id(),
      name: formData.get('name'),
      url: formData.get('url'),
      description: formData.get('description'),
      about: formData.get('topics')
        ? formData.get('topics').split(',').map(t => ({ name: t.trim() }))
        : []
    };

    try {
      if (!this.#updateBookmarkUseCase.value) {
        throw new Error('UpdateBookmarkUseCase not provided');
      }
      
      await this.#updateBookmarkUseCase.value.execute(data);
      
      this.dispatchEvent(new CustomEvent('bookmark-updated', {
        detail: data,
        bubbles: true,
        composed: true
      }));
      
      // Close the dialog explicitly if click was on button
      const dialog = this.shadowRoot.querySelector('#edit-dialog');
      dialog.close();
    } catch (err) {
      console.error('Failed to update bookmark:', err);
      this._error = err instanceof AppError ? err.message : 'An unexpected error occurred';
    }
  }
}

customElements.define('edit-bookmark-dialog', EditBookmarkDialog);
