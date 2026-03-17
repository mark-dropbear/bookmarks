import { expect } from '@esm-bundle/chai';
import { FaviconDiscovery } from './FaviconDiscovery.js';

describe('FaviconDiscovery', () => {
  it('should return empty string for invalid URL', async () => {
    const mockService = { isValidImage: async () => false };
    const discovery = new FaviconDiscovery(mockService);
    const result = await discovery.discoverFavicon('not-a-url');
    expect(result).to.equal('');
  });

  it('should discover favicon if it exists', async () => {
    const mockService = {
      isValidImage: async (url) => {
        return url === 'https://example.com/favicon.ico';
      }
    };
    const discovery = new FaviconDiscovery(mockService);
    const result = await discovery.discoverFavicon('https://example.com');
    expect(result).to.equal('https://example.com/favicon.ico');
  });

  it('should return empty string if no common favicon found', async () => {
    const mockService = { isValidImage: async () => false };
    const discovery = new FaviconDiscovery(mockService);
    const result = await discovery.discoverFavicon('https://example.com');
    expect(result).to.equal('');
  });
});
