import { LitElement, html } from 'lit';
import styles from './BookmarkItem.css' with { type: 'css' };
import '@material/web/labs/card/elevated-card.js';

/**
 * A component representing a single bookmark item.
 */
export class BookmarkItem extends LitElement {
  static styles = styles;

  static properties = {
    /** @type {import('../../domain/entities/Bookmark.js').BookmarkData} */
    bookmark: { type: Object }
  };

  render() {
    if (!this.bookmark) return html``;
    return html`
      <md-elevated-card>
        <div class="title">${this.bookmark.name}</div>
        <a class="url" href="${this.bookmark.url}" target="_blank">${this.bookmark.url}</a>
        ${this.bookmark.description ? html`<div class="desc">${this.bookmark.description}</div>` : ''}
        <div class="tags">
          ${this.bookmark.about?.map(t => html`<span class="tag">${t['@id'].replace('topic/', '')}</span>`)}
        </div>
      </md-elevated-card>
    `;
  }
}

customElements.define('bookmark-item', BookmarkItem);
