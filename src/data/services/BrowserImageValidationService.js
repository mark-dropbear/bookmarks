/**
 * Browser-specific implementation of the ImageValidationService.
 * Uses the DOM Image object to test if an image can be loaded.
 * @implements {import('../../domain/services/ImageValidationService.js').ImageValidationService}
 */
export class BrowserImageValidationService {
  /**
   * Tests if an image URL is valid and accessible using the browser's Image API.
   * @param {string} url 
   * @returns {Promise<boolean>}
   */
  isValidImage(url) {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }
}
