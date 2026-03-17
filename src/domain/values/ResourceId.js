import { Base32Codec } from '../../core/utils/Base32Codec.js';

/**
 * @typedef {string} ResourceIdString - The full string representation (e.g., 'bookmarks/12345~')
 */

export class ResourceId {
  /**
   * @param {string} type - The resource type (e.g., 'bookmarks', 'topics')
   * @param {string} value - The encoded identifier with checksum (e.g., '64S36D1N6RVKGE9GC5H6600000~')
   */
  constructor(type, value) {
    if (!type || typeof type !== 'string') {
        throw new Error('Resource type must be a valid string');
    }
    if (!ResourceId.verify(value)) {
      throw new Error(`Invalid resource identifier: ${value}`);
    }
    this.type = type;
    this.value = ResourceId.normalize(value);
  }

  /**
   * Generates a new random ResourceId.
   * @param {string} type 
   * @returns {ResourceId}
   */
  static generate(type) {
    const bytes = new Uint8Array(16);
    if (typeof globalThis.crypto === 'undefined' || !globalThis.crypto.getRandomValues) {
       throw new Error('No crypto provider available');
    }
    
    globalThis.crypto.getRandomValues(bytes);

    const intValue = Base32Codec.bytesToBigInt(bytes);
    const checksum = Number(intValue % 37n);
    const checksumChar = Base32Codec.ALPHABET[checksum];
    
    const base32Str = Base32Codec.bigIntToBase32(intValue);
    
    // Add hyphens for readability (groups of 5)
    let formatted = '';
    for (let i = 0; i < base32Str.length; i += 5) {
      formatted += base32Str.slice(i, i + 5) + '-';
    }
    formatted = formatted.replace(/-$/, ''); 
    
    return new ResourceId(type, formatted + checksumChar);
  }

  /**
   * Parses a full identifier string into a ResourceId.
   * @param {ResourceIdString} fullId - e.g., 'bookmarks/AHM6...'
   * @returns {ResourceId}
   */
  static fromString(fullId) {
    if (typeof fullId !== 'string') {
        throw new Error('Identifier must be a string');
    }
    const parts = fullId.split('/');
    if (parts.length !== 2) {
      throw new Error(`Invalid identifier format. Expected 'type/value', got '${fullId}'`);
    }
    return new ResourceId(parts[0], parts[1]);
  }

  /**
   * Normalizes the identifier string by removing hyphens, making uppercase, and substituting ambiguous characters.
   * @param {string} value 
   * @returns {string}
   */
  static normalize(value) {
    return value.replace(/-/g, '').toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1');
  }

  /**
   * Verifies the integrity of a base32 value with a checksum character.
   * @param {string} value 
   * @returns {boolean}
   */
  static verify(value) {
    try {
      if (typeof value !== 'string') return false;
      const normalized = ResourceId.normalize(value);
      if (normalized.length < 2) return false;
      
      const idStr = normalized.slice(0, -1);
      const checksumChar = normalized.slice(-1);
      
      const intValue = Base32Codec.base32ToBigInt(idStr);
      const expectedChecksum = Number(intValue % 37n);
      
      return Base32Codec.ALPHABET[expectedChecksum] === checksumChar;
    } catch (_e) {
      return false;
    }
  }

  /**
   * Returns the full string representation (e.g., 'bookmarks/12345~')
   * @returns {ResourceIdString}
   */
  toString() {
    return `${this.type}/${this.value}`;
  }

  toJSON() {
    return this.toString();
  }
}
