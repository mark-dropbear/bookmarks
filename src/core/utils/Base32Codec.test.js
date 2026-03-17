import { expect } from '@esm-bundle/chai';
import { Base32Codec } from './Base32Codec.js';

describe('Base32Codec', () => {
    it('should convert bytes to BigInt', () => {
        const bytes = new Uint8Array([0x01, 0x02]);
        const bigInt = Base32Codec.bytesToBigInt(bytes);
        expect(bigInt).to.equal(258n);
    });

    it('should convert BigInt to Base32', () => {
        const bigInt = 32n;
        const base32 = Base32Codec.bigIntToBase32(bigInt);
        expect(base32).to.equal('00000000000000000000000010');
    });

    it('should convert Base32 to BigInt', () => {
        const base32 = '00000000000000000000000010';
        const bigInt = Base32Codec.base32ToBigInt(base32);
        expect(bigInt).to.equal(32n);
    });

    it('should perform round-trip conversion', () => {
        const originalBytes = new Uint8Array([0xFF, 0xAA, 0x11, 0x00]);
        const bigInt = Base32Codec.bytesToBigInt(originalBytes);
        const base32 = Base32Codec.bigIntToBase32(bigInt);
        const decodedBigInt = Base32Codec.base32ToBigInt(base32);
        expect(decodedBigInt).to.equal(bigInt);
    });
});
