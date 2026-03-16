import { expect } from '@esm-bundle/chai';
import { FaviconDiscovery } from './FaviconDiscovery.js';

describe('FaviconDiscovery', () => {
  it('should return empty string for invalid URL', async () => {
    const result = await FaviconDiscovery.discoverFavicon('not-a-url');
    expect(result).to.equal('');
  });

  it('should discover favicon if it exists', async () => {
    // Mock Image
    const originalImage = window.Image;
    window.Image = class {
      set src(url) {
        if (url === 'https://example.com/favicon.ico') {
          setTimeout(() => this.onload(), 0);
        } else {
          setTimeout(() => this.onerror(), 0);
        }
      }
    };

    const result = await FaviconDiscovery.discoverFavicon('https://example.com');
    expect(result).to.equal('https://example.com/favicon.ico');

    window.Image = originalImage;
  });

  it('should return empty string if no common favicon found', async () => {
    // Mock Image to always fail
    const originalImage = window.Image;
    window.Image = class {
      set src(url) {
        setTimeout(() => this.onerror(), 0);
      }
    };

    const result = await FaviconDiscovery.discoverFavicon('https://example.com');
    expect(result).to.equal('');

    window.Image = originalImage;
  });
});
