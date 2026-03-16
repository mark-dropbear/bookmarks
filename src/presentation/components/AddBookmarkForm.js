import { LitElement, html, css } from 'lit';
import { ContextConsumer } from '@lit/context';
import { addBookmarkContext } from '../context.js';

import '@material/web/button/filled-button.js';
import '@material/web/textfield/outlined-text-field.js';

/**
 * A form component for adding new bookmarks.
 * Consumes the AddBookmarkUseCase via context.
 */
export class AddBookmarkForm extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 400px;
    }
  `;

  // Consume the use case from context
  #addBookmarkUseCase = new ContextConsumer(this, {
    context: addBookmarkContext,
    subscribe: true,
  });

  render() {
    return html`
      <form @submit=${this.#handleSubmit}>
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
    }
  }
}

customElements.define('add-bookmark-form', AddBookmarkForm);
