import { expect } from '@esm-bundle/chai';
import { BookmarkDashboard } from './BookmarkDashboard.js';
import { getBookmarksContext } from '../context.js';
import { ContextProvider } from '@lit/context';

describe('BookmarkDashboard', () => {
  let el;
  let mockUseCase;

  beforeEach(async () => {
    mockUseCase = {
      execute: (query) => {
        const data = [
          { '@id': '1', name: 'Lit', url: 'https://lit.dev', about: [] },
          { '@id': '2', name: 'MDW', url: 'https://m3.material.io', about: [] }
        ];
        if (!query) return Promise.resolve(data);
        return Promise.resolve(data.filter(b => b.name.toLowerCase().includes(query.toLowerCase())));
      }
    };

    const container = document.createElement('div');
    new ContextProvider(container, {
      context: getBookmarksContext,
      initialValue: mockUseCase
    });

    el = new BookmarkDashboard();
    container.appendChild(el);
    document.body.appendChild(container);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('filters the list when searching', async () => {
    const searchField = el.shadowRoot.querySelector('md-outlined-text-field');
    const bookmarkList = el.shadowRoot.querySelector('bookmark-list');

    // Initial state
    await new Promise(r => setTimeout(r, 100)); // Wait for task
    expect(bookmarkList.shadowRoot.querySelectorAll('bookmark-item')).to.have.lengthOf(2);

    // Type in search
    searchField.value = 'Lit';
    searchField.dispatchEvent(new Event('input'));
    
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100)); // Wait for task re-run
    
    expect(bookmarkList.shadowRoot.querySelectorAll('bookmark-item')).to.have.lengthOf(1);
    expect(bookmarkList.shadowRoot.querySelector('bookmark-item').bookmark.name).to.equal('Lit');
  });
});
