export class Base32Codec {
  static ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ*~$=U';
  static BASE32_ALPHABET = Base32Codec.ALPHABET.slice(0, 32);

  /**
   * Converts a Uint8Array of bytes into a BigInt.
   * @param {Uint8Array} bytes 
   * @returns {BigInt}
   */
  static bytesToBigInt(bytes) {
    let hex = '';
    for (const b of bytes) {
      hex += b.toString(16).padStart(2, '0');
    }
    return BigInt('0x' + hex);
  }

  /**
   * Converts a BigInt to a Crockford Base32 string, padded to 26 characters (for 128-bit values).
   * @param {BigInt} bigIntValue 
   * @returns {string}
   */
  static bigIntToBase32(bigIntValue) {
    if (bigIntValue === 0n) return '0'.padStart(26, '0');
    let result = '';
    let temp = bigIntValue;
    while (temp > 0n) {
      const rem = Number(temp % 32n);
      result = Base32Codec.BASE32_ALPHABET[rem] + result;
      temp = temp / 32n;
    }
    return result.padStart(26, '0');
  }

  /**
   * Converts a Crockford Base32 string to a BigInt.
   * @param {string} str 
   * @returns {BigInt}
   */
  static base32ToBigInt(str) {
    let result = 0n;
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const val = Base32Codec.BASE32_ALPHABET.indexOf(char);
      if (val === -1) throw new Error(`Invalid Base32 character: ${char}`);
      result = result * 32n + BigInt(val);
    }
    return result;
  }
}
