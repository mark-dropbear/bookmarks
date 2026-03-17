import { expect } from '@esm-bundle/chai';
import { ResourceId } from './ResourceId.js';

describe('ResourceId', () => {
    it('should generate a valid resource id', () => {
        const id = ResourceId.generate('books');
        expect(id.type).to.equal('books');
        expect(id.value.length).to.be.greaterThan(10);
        expect(ResourceId.verify(id.value)).to.be.true;
    });

    it('should format string properly', () => {
        const id = ResourceId.generate('books');
        const str = id.toString();
        expect(str.startsWith('books/')).to.be.true;
    });

    it('should parse from string correctly', () => {
        const id = ResourceId.generate('books');
        const str = id.toString();
        
        const parsed = ResourceId.fromString(str);
        expect(parsed.type).to.equal('books');
        expect(parsed.value).to.equal(ResourceId.normalize(id.value));
    });

    it('should reject invalid checksums', () => {
        const id = ResourceId.generate('books');
        const str = id.toString();
        // Modify a character in the value
        const lastChar = str.slice(-1);
        const secondToLast = str.slice(-2, -1);
        
        // Mutate the second to last character (part of the value)
        const mutatedChar = secondToLast === 'A' ? 'B' : 'A';
        const badStr = str.slice(0, -2) + mutatedChar + lastChar;
        
        expect(() => ResourceId.fromString(badStr)).to.throw(/Invalid resource identifier/);
    });

    it('should normalize confusing characters', () => {
        // Create an ID directly bypassing generator
        // Value: '10' -> Base32 To BigInt: 32n
        // Checksum: 32n % 37n = 32 -> '*'
        // The value string is '10*'
        const _id = new ResourceId('test', '10*');
        // 'I' and 'O' should normalize to '1' and '0'
        expect(ResourceId.verify('IO*')).to.be.true;

        const parsedId = new ResourceId('test', 'IO*');
        expect(parsedId.value).to.equal('10*');
    });


    it('should handle hyphens gracefully', () => {
        const id = new ResourceId('test', '1-0-*');
        expect(id.value).to.equal('10*');
    });
});
