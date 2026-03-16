import { LitElement, html } from 'lit';
import '@material/web/button/filled-button.js';
import '@material/web/textfield/outlined-text-field.js';
import { Router } from '@lit-labs/router';

export class BookmarksApp extends LitElement {
  render() {
    return html`<h1>Bookmarks</h1>`;
  }
}

customElements.define('bookmarks-app', BookmarksApp);
