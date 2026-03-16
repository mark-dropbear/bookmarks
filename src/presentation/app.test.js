import { expect } from '@esm-bundle/chai';
import { BookmarksApp } from './app.js';

describe('BookmarksApp', () => {
  let el;

  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    el = new BookmarksApp();
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(el);
    document.documentElement.removeAttribute('data-theme');
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

  it('changes theme when selector is used', async () => {
    const selector = el.shadowRoot.querySelector('md-outlined-select');
    expect(selector).to.exist;

    // Change to dark
    selector.value = 'dark';
    selector.dispatchEvent(new Event('change'));
    await el.updateComplete;

    expect(document.documentElement.getAttribute('data-theme')).to.equal('dark');
    expect(localStorage.getItem('theme-preference')).to.equal('dark');

    // Change back to auto
    selector.value = 'auto';
    selector.dispatchEvent(new Event('change'));
    await el.updateComplete;

    expect(document.documentElement.hasAttribute('data-theme')).to.be.false;
    expect(localStorage.getItem('theme-preference')).to.be.null;
  });

  it('applies the correct CSS tokens for dark mode', async () => {
    const selector = el.shadowRoot.querySelector('md-outlined-select');
    selector.value = 'dark';
    selector.dispatchEvent(new Event('change'));
    await el.updateComplete;

    // Check a specific token that is different in dark mode
    // Light Primary: rgb(76, 102, 43)
    // Dark Primary: rgb(177, 209, 138)
    const h1 = el.shadowRoot.querySelector('h1');
    const color = getComputedStyle(h1).color;
    
    expect(color).to.contain('177');
    expect(color).to.contain('209');
    expect(color).to.contain('138');
  });
});
