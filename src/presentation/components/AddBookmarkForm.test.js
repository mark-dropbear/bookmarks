import { expect } from '@esm-bundle/chai';
import { AddBookmarkForm } from './AddBookmarkForm.js';
import { addBookmarkContext } from '../context.js';
import { ContextProvider } from '@lit/context';

describe('AddBookmarkForm', () => {
  let el;
  let mockUseCase;

  beforeEach(async () => {
    mockUseCase = {
      execute: (data) => {
        mockUseCase.lastData = data;
        return Promise.resolve({ id: '123', ...data });
      }
    };

    const container = document.createElement('div');
    const _provider = new ContextProvider(container, {
      context: addBookmarkContext,
      initialValue: mockUseCase
    });

    el = new AddBookmarkForm();

    container.appendChild(el);
    document.body.appendChild(container);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders input fields and a submit button', () => {
    const nameInput = el.shadowRoot.querySelector('md-outlined-text-field[label="Title"]');
    const urlInput = el.shadowRoot.querySelector('md-outlined-text-field[label="URL"]');
    const submitButton = el.shadowRoot.querySelector('md-filled-button');

    expect(nameInput).to.exist;
    expect(urlInput).to.exist;
    expect(submitButton).to.exist;
  });

  it('calls the use case on submit', async () => {
    const nameInput = el.shadowRoot.querySelector('md-outlined-text-field[name="name"]');
    const urlInput = el.shadowRoot.querySelector('md-outlined-text-field[name="url"]');
    const topicsInput = el.shadowRoot.querySelector('md-outlined-text-field[name="topics"]');
    const form = el.shadowRoot.querySelector('form');

    nameInput.value = 'My Bookmark';
    urlInput.value = 'https://lit.dev';
    topicsInput.value = 'Lit, Web Components';
    
    // Simulate form submission
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    
    // UseCase is async, wait a tick
    await new Promise(r => setTimeout(r, 0));

    expect(mockUseCase.lastData.name).to.equal('My Bookmark');
    expect(mockUseCase.lastData.url).to.equal('https://lit.dev');
    expect(mockUseCase.lastData.topicNames).to.deep.equal(['Lit', 'Web Components']);
  });
});
