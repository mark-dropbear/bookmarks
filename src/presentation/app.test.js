import { expect } from '@esm-bundle/chai';
import { BookmarksApp } from './app.js';

describe('BookmarksApp', () => {
  it('is defined', () => {
    const el = document.createElement('bookmarks-app');
    expect(el).to.be.instanceOf(BookmarksApp);
  });

  it('renders a heading', async () => {
    const el = new BookmarksApp();
    document.body.appendChild(el);
    await el.updateComplete;
    const h1 = el.shadowRoot.querySelector('h1');
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('Bookmarks');
    document.body.removeChild(el);
  });
});
