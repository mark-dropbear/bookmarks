/**
 * Shared logic for discovering favicons.
 */
export const FaviconDiscovery = {
  /**
   * Attempts to find a favicon for the given URL by testing common extensions.
   * @param {string} url 
   * @returns {Promise<string>} The URL of the found favicon, or empty string.
   */
  async discoverFavicon(url) {
    try {
      const urlObj = new URL(url);
      const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
      const extensions = ['ico', 'svg', 'png'];

      for (const ext of extensions) {
        const faviconUrl = `${baseUrl}/favicon.${ext}`;
        const exists = await this.testImageUrl(faviconUrl);
        if (exists) {
          return faviconUrl;
        }
      }
    } catch (e) {
      // Invalid URL - we just return empty image instead of crashing
    }
    return '';
  },

  /**
   * Tests if an image URL is valid and accessible.
   * @param {string} url 
   * @returns {Promise<boolean>}
   */
  testImageUrl(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }
};
