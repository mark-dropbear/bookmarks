import { expect } from '@esm-bundle/chai';
import { fixture, html, waitUntil } from '@open-wc/testing-helpers';
import './EditBookmarkDialog.js';
import { Bookmark } from '../../domain/entities/Bookmark.js';

import { ContextProvider } from '@lit/context';
import { updateBookmarkContext } from '../context.js';

describe('EditBookmarkDialog', () => {
  let el;
  let mockUpdateUseCase;
  let bookmark;

  beforeEach(async () => {
    bookmark = new Bookmark({ id: 'b/1', name: 'Original', url: 'https://test.com' });
    mockUpdateUseCase = {
      execute: (data) => {
        mockUpdateUseCase.calledWith = data;
        return Promise.resolve(Bookmark.fromJSON(data));
      }
    };

    const parent = await fixture(html`
      <div></div>
    `);

    new ContextProvider(parent, {
      context: updateBookmarkContext,
      initialValue: mockUpdateUseCase
    });

    el = document.createElement('edit-bookmark-dialog');
    parent.appendChild(el);
    el.bookmark = bookmark;
    await el.updateComplete;
  });

  it('pre-populates fields with bookmark data', async () => {
    const dialog = el.shadowRoot.querySelector('md-dialog');
    expect(dialog).to.exist;
    
    const nameField = el.shadowRoot.querySelector('md-outlined-text-field[name="name"]');
    expect(nameField.value).to.equal('Original');
    
    const urlField = el.shadowRoot.querySelector('md-outlined-text-field[name="url"]');
    expect(urlField.value).to.equal('https://test.com');
  });

  it('calls UpdateBookmarkUseCase on submit', async () => {
    const nameField = el.shadowRoot.querySelector('md-outlined-text-field[name="name"]');
    nameField.value = 'New Name';
    nameField.dispatchEvent(new Event('input'));

    const saveButton = Array.from(el.shadowRoot.querySelectorAll('md-text-button'))
      .find(b => b.value === 'save');
    
    saveButton.click();

    await waitUntil(() => mockUpdateUseCase.calledWith, 'UseCase was not called');
    expect(mockUpdateUseCase.calledWith.name).to.equal('New Name');
  });
});
