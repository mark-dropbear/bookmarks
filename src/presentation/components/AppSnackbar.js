import { LitElement, html } from 'lit';
import styles from './AppSnackbar.css' with { type: 'css' };
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';

/**
 * A simple Material 3 compliant Snackbar component.
 */
export class AppSnackbar extends LitElement {
  static styles = [typescaleStyles, styles];

  static properties = {
    message: { type: String },
    open: { type: Boolean, reflect: true },
    timeout: { type: Number }
  };

  constructor() {
    super();
    this.message = '';
    this.open = false;
    this.timeout = 4000;
    this._timer = null;
  }

  /**
   * Shows the snackbar with a message.
   * @param {string} message 
   */
  show(message) {
    if (this._timer) clearTimeout(this._timer);
    
    this.message = message;
    this.open = true;
    
    this._timer = setTimeout(() => {
      this.open = false;
    }, this.timeout);
  }

  render() {
    return html`
      <div class="snackbar" aria-live="polite">
        <div class="message md-typescale-body-medium">${this.message}</div>
      </div>
    `;
  }
}

customElements.define('app-snackbar', AppSnackbar);
