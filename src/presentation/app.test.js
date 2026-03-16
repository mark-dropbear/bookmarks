import { expect } from '@esm-bundle/chai';
import { BookmarksApp } from './app.js';

describe('BookmarksApp', () => {
  let el;

  beforeEach(async () => {
    el = new BookmarksApp();
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('renders a heading', () => {
    const h1 = el.shadowRoot.querySelector('h1');
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('Bookmarks');
  });

  it('renders the dashboard by default', async () => {
    // Wait for router to render initial route
    await new Promise(r => setTimeout(r, 50)); 
    const dashboard = el.shadowRoot.querySelector('bookmark-dashboard');
    expect(dashboard).to.exist;
  });

  it('navigates to the add page', async () => {
    const addButton = el.shadowRoot.querySelectorAll('md-filled-button')[1];
    addButton.click();
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50)); 
    const addPage = el.shadowRoot.querySelector('add-bookmark-page');
    expect(addPage).to.exist;
  });
});
