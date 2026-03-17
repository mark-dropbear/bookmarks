/**
 * Interface for services that validate the existence and accessibility of images.
 * @interface ImageValidationService
 */
export class ImageValidationService {
  /**
   * Tests if an image URL is valid and accessible.
   * @param {string} url - The URL of the image to test.
   * @returns {Promise<boolean>} True if the image exists and is valid, false otherwise.
   */
  async isValidImage(url) {
    throw new Error('Not implemented');
  }
}
