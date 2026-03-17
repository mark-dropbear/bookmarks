import { expect } from '@esm-bundle/chai';
import { fixture, html, waitUntil } from '@open-wc/testing-helpers';
import './BookmarkList.js';

import { getBookmarksContext } from '../context.js';
import { ContextProvider } from '@lit/context';

describe('BookmarkList', () => {
  let el;
  let mockUseCase;

  beforeEach(async () => {
    mockUseCase = {
      execute: () => Promise.resolve([
        { id: '1', name: 'Test 1', url: 'https://test1.com', topicIds: [] },
        { id: '2', name: 'Test 2', url: 'https://test2.com', topicIds: [] }
      ])
    };

    const container = await fixture(html`<div></div>`);
    new ContextProvider(container, {
      context: getBookmarksContext,
      initialValue: mockUseCase
    });

    el = document.createElement('bookmark-list');
    container.appendChild(el);
    await el.updateComplete;
  });

  it('renders a list of bookmarks', async () => {
    await waitUntil(() => el.shadowRoot.querySelectorAll('bookmark-item').length === 2, 'List did not render');
    const items = el.shadowRoot.querySelectorAll('bookmark-item');
    expect(items[0].bookmark.name).to.equal('Test 1');
    expect(items[1].bookmark.name).to.equal('Test 2');
  });
});
