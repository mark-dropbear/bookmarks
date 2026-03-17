/**
 * Shared logic for discovering favicons.
 */
export class FaviconDiscovery {
  /**
   * Initializes the discovery service.
   * @param {import('../services/ImageValidationService.js').ImageValidationService} imageValidationService
   */
  constructor(imageValidationService) {
    this.imageValidationService = imageValidationService;
  }

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
        const exists = await this.imageValidationService.isValidImage(faviconUrl);
        if (exists) {
          return faviconUrl;
        }
      }
    } catch (_e) {
      // Invalid URL - we just return empty image instead of crashing
    }
    return '';
  }
}
