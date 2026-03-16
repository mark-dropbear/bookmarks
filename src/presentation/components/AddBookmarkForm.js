import { LitElement, html } from 'lit';
import styles from './AddBookmarkForm.css' with { type: 'css' };
import { ContextConsumer } from '@lit/context';
import { addBookmarkContext } from '../context.js';
import { AppError } from '../../core/errors/AppErrors.js';

import '@material/web/button/filled-button.js';
import '@material/web/textfield/outlined-text-field.js';

/**
 * A form component for adding new bookmarks.
 * Consumes the AddBookmarkUseCase via context.
 */
export class AddBookmarkForm extends LitElement {
  static properties = {
    _error: { state: true }
  };

  static styles = styles;

  constructor() {
    super();
    this._error = null;
  }

  // Consume the use case from context
  #addBookmarkUseCase = new ContextConsumer(this, {
    context: addBookmarkContext,
    subscribe: true,
  });

  render() {
    return html`
      <form @submit=${this.#handleSubmit}>
        ${this._error ? html`<div class="error-message">${this._error}</div>` : ''}
        <md-outlined-text-field label="Title" name="name" required></md-outlined-text-field>
        <md-outlined-text-field label="URL" name="url" type="url" required></md-outlined-text-field>
        <md-outlined-text-field label="Description" name="description"></md-outlined-text-field>
        <md-outlined-text-field label="Topics (comma separated)" name="topics"></md-outlined-text-field>
        <md-filled-button type="submit">Save Bookmark</md-filled-button>
      </form>
    `;
  }

  /**
   * Handles the form submission.
   * @param {Event} e 
   */
  async #handleSubmit(e) {
    e.preventDefault();
    this._error = null;
    const form = e.target;
    const formData = new FormData(form);
    
    const data = {
      name: formData.get('name'),
      url: formData.get('url'),
      description: formData.get('description'),
      about: formData.get('topics')
        ? formData.get('topics').split(',').map(t => ({ '@id': `topic/${t.trim()}` }))
        : []
    };

    try {
      if (!this.#addBookmarkUseCase.value) {
        throw new Error('AddBookmarkUseCase not provided');
      }
      await this.#addBookmarkUseCase.value.execute(data);
      this.dispatchEvent(new CustomEvent('bookmark-added', {
        detail: data,
        bubbles: true,
        composed: true
      }));
      if (form && typeof form.reset === 'function') {
        form.reset();
      }
    } catch (err) {
      console.error('Failed to add bookmark:', err);
      this._error = err instanceof AppError ? err.message : 'An unexpected error occurred';
    }
  }
}

customElements.define('add-bookmark-form', AddBookmarkForm);
