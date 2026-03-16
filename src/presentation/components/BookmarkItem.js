import { LitElement, html } from 'lit';
import styles from './BookmarkItem.css' with { type: 'css' };
import '@material/web/labs/card/elevated-card.js';

/**
 * A component representing a single bookmark item.
 * Displays the title, URL, description, topics, and an optional favicon image.
 */
export class BookmarkItem extends LitElement {
  static styles = styles;

  static properties = {
    /** 
     * The bookmark data object (JSON-LD compliant).
     * @type {import('../../domain/entities/Bookmark.js').BookmarkData} 
     */
    bookmark: { type: Object }
  };

  render() {
    if (!this.bookmark) return html``;
    return html`
      <md-elevated-card>
        <div class="header">
          ${this.bookmark.image 
            ? html`<img class="favicon" src="${this.bookmark.image}" alt="" loading="lazy" @error=${this.#handleImageError}>` 
            : ''}
          <div class="title">${this.bookmark.name}</div>
        </div>
        <a class="url" href="${this.bookmark.url}" target="_blank">${this.bookmark.url}</a>
        ${this.bookmark.description ? html`<div class="desc">${this.bookmark.description}</div>` : ''}
        <div class="tags">
          ${this.bookmark.about?.map(t => html`<span class="tag">${t['@id'].replace('topic/', '')}</span>`)}
        </div>
      </md-elevated-card>
    `;
  }

  /**
   * Handles image loading errors by hiding the image.
   * @param {Event} e 
   */
  #handleImageError(e) {
    const target = /** @type {HTMLImageElement} */ (e.target);
    target.style.display = 'none';
  }
}

customElements.define('bookmark-item', BookmarkItem);
