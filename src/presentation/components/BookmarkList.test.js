import { expect } from '@esm-bundle/chai';
import { BookmarkList } from './BookmarkList.js';
import { getBookmarksContext } from '../context.js';
import { ContextProvider } from '@lit/context';

describe('BookmarkList', () => {
  let el;
  let mockUseCase;

  beforeEach(async () => {
    mockUseCase = {
      execute: () => Promise.resolve([
        { '@id': '1', name: 'Lit', url: 'https://lit.dev', about: [] },
        { '@id': '2', name: 'MDW', url: 'https://m3.material.io', about: [] }
      ])
    };

    const container = document.createElement('div');
    new ContextProvider(container, {
      context: getBookmarksContext,
      initialValue: mockUseCase
    });

    el = new BookmarkList();
    container.appendChild(el);
    document.body.appendChild(container);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a list of bookmarks', async () => {
    // Wait for Controller task to complete
    await new Promise(r => setTimeout(r, 50));
    await el.updateComplete;

    const items = el.shadowRoot.querySelectorAll('bookmark-item');
    expect(items).to.have.lengthOf(2);
    // items[0].bookmark is data now
    expect(items[0].bookmark.name).to.equal('Lit');
  });
});
