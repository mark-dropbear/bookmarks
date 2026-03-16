import { expect } from '@esm-bundle/chai';
import { fixture, html, waitUntil } from '@open-wc/testing-helpers';
import { AppSnackbar } from './AppSnackbar.js';

describe('AppSnackbar', () => {
  let el;

  beforeEach(async () => {
    el = await fixture(html`<app-snackbar></app-snackbar>`);
  });

  it('is hidden by default', () => {
    expect(el.open).to.be.false;
    const snackbar = el.shadowRoot.querySelector('.snackbar');
    // The opacity transition means we should check the property
    expect(el.hasAttribute('open')).to.be.false;
  });

  it('shows the provided message', async () => {
    el.show('Hello World');
    await el.updateComplete;

    expect(el.open).to.be.true;
    expect(el.message).to.equal('Hello World');
    
    const messageDiv = el.shadowRoot.querySelector('.message');
    expect(messageDiv.textContent).to.equal('Hello World');
  });

  it('automatically closes after the timeout', async () => {
    // Set a short timeout for the test
    el.timeout = 100;
    el.show('Quick message');
    
    expect(el.open).to.be.true;

    // Wait for the timeout + a buffer
    await new Promise(r => setTimeout(r, 150));
    
    expect(el.open).to.be.false;
  });

  it('resets the timer if shown again before closing', async () => {
    el.timeout = 200;
    el.show('First');
    
    // Show second message after 100ms
    await new Promise(r => setTimeout(r, 100));
    el.show('Second');
    
    // At 250ms, it should still be open (timer was reset)
    await new Promise(r => setTimeout(r, 150));
    expect(el.open).to.be.true;
    expect(el.message).to.equal('Second');

    // Eventually closes
    await new Promise(r => setTimeout(r, 100));
    expect(el.open).to.be.false;
  });
});
