import { expect } from '@esm-bundle/chai';
import { fixture, html, waitUntil } from '@open-wc/testing-helpers';
import { BookmarkDashboard } from './BookmarkDashboard.js';
import { Bookmark } from '../../domain/entities/Bookmark.js';
import { getBookmarksContext, deleteBookmarkContext, updateBookmarkContext } from '../context.js';
import { ContextProvider } from '@lit/context';

describe('BookmarkDashboard', () => {
  let el;
  let mockGetUseCase;
  let mockDeleteUseCase;
  let mockUpdateUseCase;

  beforeEach(async () => {
    mockGetUseCase = {
      execute: (query) => {
        const data = [
          new Bookmark({ id: '1', name: 'Lit', url: 'https://lit.dev', about: [] }),
          new Bookmark({ id: '2', name: 'MDW', url: 'https://m3.material.io', about: [] })
        ];
        if (!query) return Promise.resolve(data);
        return Promise.resolve(data.filter(b => b.name().toLowerCase().includes(query.toLowerCase())));
      }
    };

    mockDeleteUseCase = {
      execute: (id) => {
        mockDeleteUseCase.calledWith = id;
        return Promise.resolve();
      }
    };

    mockUpdateUseCase = {
      execute: (data) => Promise.resolve(data)
    };

    const container = await fixture(html`<div></div>`);
    
    new ContextProvider(container, {
      context: getBookmarksContext,
      initialValue: mockGetUseCase
    });

    new ContextProvider(container, {
      context: deleteBookmarkContext,
      initialValue: mockDeleteUseCase
    });

    new ContextProvider(container, {
      context: updateBookmarkContext,
      initialValue: mockUpdateUseCase
    });

    el = document.createElement('bookmark-dashboard');
    container.appendChild(el);
    await el.updateComplete;
  });

  it('filters the list when searching', async () => {
    const searchField = el.shadowRoot.querySelector('md-outlined-text-field');
    const bookmarkList = el.shadowRoot.querySelector('bookmark-list');

    await waitUntil(() => 
      bookmarkList.shadowRoot.querySelectorAll('bookmark-item').length === 2,
      'List did not load'
    );

    searchField.value = 'Lit';
    searchField.dispatchEvent(new Event('input'));
    
    await el.updateComplete;
    
    await waitUntil(() => 
      bookmarkList.shadowRoot.querySelectorAll('bookmark-item').length === 1,
      'List did not filter'
    );
    const filteredItem = bookmarkList.shadowRoot.querySelector('bookmark-item');
    expect(filteredItem.bookmark.name()).to.equal('Lit');
  });

  it('opens delete confirmation dialog and calls use case', async () => {
    const bookmarkList = el.shadowRoot.querySelector('bookmark-list');
    await waitUntil(() => 
      bookmarkList.shadowRoot.querySelector('bookmark-item'),
      'Item did not load'
    );

    const item = bookmarkList.shadowRoot.querySelector('bookmark-item');
    await item.updateComplete;

    // Target the second icon button (delete is usually second in my template)
    const deleteButton = item.shadowRoot.querySelectorAll('md-icon-button')[1];

    deleteButton.click();
    await el.updateComplete;

    const dialog = el.shadowRoot.querySelector('#delete-dialog');
    await waitUntil(() => dialog.open, 'Dialog did not open');

    const confirmButton = Array.from(dialog.querySelectorAll('md-text-button'))
      .find(b => b.value === 'delete');

    confirmButton.click();

    await waitUntil(() => mockDeleteUseCase.calledWith === '1', 'Delete UseCase not called');
  });

  it('opens edit dialog when edit is clicked', async () => {
    const bookmarkList = el.shadowRoot.querySelector('bookmark-list');
    await waitUntil(() => 
      bookmarkList.shadowRoot.querySelector('bookmark-item'),
      'Item did not load'
    );

    const item = bookmarkList.shadowRoot.querySelector('bookmark-item');
    await item.updateComplete;

    // Target the first icon button (edit)
    const editButton = item.shadowRoot.querySelectorAll('md-icon-button')[0];

    editButton.click();
    await el.updateComplete;

    const editDialog = el.shadowRoot.querySelector('edit-bookmark-dialog');
    await waitUntil(() => editDialog.bookmark, 'Edit dialog did not receive bookmark');
    expect(editDialog.bookmark.id()).to.equal('1');
  });

});
