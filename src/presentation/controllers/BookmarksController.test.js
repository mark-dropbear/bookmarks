import { expect } from '@esm-bundle/chai';
import { BookmarksController } from './BookmarksController.js';
import { getBookmarksContext } from '../context.js';
import { ContextProvider } from '@lit/context';
import { LitElement, html } from 'lit';
import { TaskStatus } from '@lit/task';

class MockHost extends LitElement {
  static get properties() {
    return {
      searchQuery: { type: String }
    };
  }
  constructor() {
    super();
    this.searchQuery = '';
  }
  render() {
    return html``;
  }
}
customElements.define('mock-host', MockHost);

describe('BookmarksController', () => {
  let container;
  let host;
  let controller;
  let mockUseCase;

  beforeEach(async () => {
    mockUseCase = {
      execute: (query) => Promise.resolve([
        { id: '1', name: `Result for ${query || 'all'}`, url: 'https://test.com', topicIds: [] }
      ])
    };

    container = document.createElement('div');
    new ContextProvider(container, {
      context: getBookmarksContext,
      initialValue: mockUseCase
    });

    host = new MockHost();
    container.appendChild(host);
    document.body.appendChild(container);
    
    controller = new BookmarksController(host);
    await host.updateComplete;
  });

  afterEach(() => {
    if (container.parentElement) {
      document.body.removeChild(container);
    }
  });

  /**
   * Helper to wait for the task to complete with a non-empty value.
   */
  const waitForData = async (ctrl, timeout = 2000) => {
    const start = Date.now();
    while (ctrl.status() !== TaskStatus.COMPLETE || !ctrl.value() || ctrl.value().length === 0) {
      if (Date.now() - start > timeout) {
        throw new Error(`Timeout waiting for data. Status: ${ctrl.status()}, Value: ${JSON.stringify(ctrl.value())}`);
      }
      await new Promise(r => setTimeout(r, 50));
    }
  };

  it('fetches bookmarks on init', async () => {
    await waitForData(controller);
    expect(controller.value()).to.exist;
    expect(controller.value()[0].name).to.equal('Result for all');
  });

  it('refetches when host searchQuery changes', async () => {
    await waitForData(controller);
    
    host.searchQuery = 'test';
    await host.updateComplete;
    
    const start = Date.now();
    while (controller.value()[0].name !== 'Result for test') {
      if (Date.now() - start > 2000) {
        throw new Error(`Timeout waiting for refetch. Value: ${JSON.stringify(controller.value())}`);
      }
      await new Promise(r => setTimeout(r, 50));
    }
    
    expect(controller.value()[0].name).to.equal('Result for test');
  });
});
