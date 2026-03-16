import { LitElement, html } from 'lit';
import styles from './BookmarkItem.css' with { type: 'css' };
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';

import '@material/web/labs/card/elevated-card.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';

/**
 * A component representing a single bookmark item.
 */
export class BookmarkItem extends LitElement {
  static styles = [typescaleStyles, styles];

  static properties = {
    /** @type {import('../../domain/entities/Bookmark.js').Bookmark} */
    bookmark: { type: Object }
  };

  render() {
    if (!this.bookmark) return html``;

    return html`
      <md-elevated-card>
        <div class="header">
          ${this.bookmark.image ? html`
            <img class="favicon" src=${this.bookmark.image()} alt="" @error=${this.#handleImageError}>
          ` : ''}
          <div class="title md-typescale-title-medium">${this.bookmark.name()}</div>
        </div>
        <a class="url md-typescale-body-medium" href=${this.bookmark.url()} target="_blank" rel="noopener">
          ${this.bookmark.url()}
        </a>
        ${this.bookmark.description() ? html`
          <div class="desc md-typescale-body-medium">${this.bookmark.description()}</div>
        ` : ''}
        ${this.bookmark.about && this.bookmark.about().length > 0 ? html`
          <div class="tags">
            ${this.bookmark.about().map(tag => html`
              <span class="tag md-typescale-label-medium">${tag['@id'].replace('topic/', '')}</span>
            `)}
          </div>
        ` : ''}
        <div class="actions">
          <md-icon-button aria-label="Edit bookmark" @click=${this.#handleEdit}>
            <md-icon>edit</md-icon>
          </md-icon-button>
          <md-icon-button aria-label="Delete bookmark" @click=${this.#handleDelete}>
            <md-icon>delete</md-icon>
          </md-icon-button>
        </div>
      </md-elevated-card>
    `;
  }

  #handleImageError(e) {
    e.target.style.display = 'none';
  }

  #handleEdit() {
    this.dispatchEvent(new CustomEvent('edit-bookmark', {
      detail: { bookmark: this.bookmark },
      bubbles: true,
      composed: true
    }));
  }

  #handleDelete() {
    this.dispatchEvent(new CustomEvent('delete-bookmark', {
      detail: { id: this.bookmark.id() },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('bookmark-item', BookmarkItem);
