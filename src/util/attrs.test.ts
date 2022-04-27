import { filter } from '@/util/attrs';
import { describe, expect, it } from 'vitest';

describe('Filter attributes', () => {
    const expected = {
        foo: 'some string',
        bar: 1
    };

    it('should filter the given attributes', () => {
        const attributes = Object.assign({}, expected, { baz: true, 'data-foo': [] });
        const exclude = [ 'baz', 'data-foo' ];
        expect(filter(attributes, exclude)).toEqual(expected);
    });

    it('should return attributes when no usable attributes are given', () => {
        const exclude = [ 'baz', 'data-foo' ];
        expect(filter(expected, exclude)).toEqual(expected);

        expect(filter(null, [ 'foo' ])).toBeNull();
        expect(filter({}, [ 'foo' ])).toEqual({});
    });

    it('should not filter when no usable exclude is given', () => {
        expect(filter(expected, null)).toEqual(expected);
        expect(filter(expected, [])).toEqual(expected);
    });
});
