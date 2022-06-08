import { exclude, include } from '@/util/attrs';
import { describe, expect, it } from 'vitest';

describe('Filter attributes', () => {
    const expected = {
        foo: 'some string',
        bar: 1
    };

    it('should filter the given attributes', () => {
        const attributes = Object.assign({}, expected, { baz: true, 'data-foo': [] });
        const excluding = [ 'baz', 'data-foo' ];
        expect(exclude(attributes, excluding)).toEqual(expected);
    });

    it('should filter all except the given attributes', () => {
        const attributes = Object.assign({}, expected, { baz: true, 'data-foo': [] });
        const including = [ 'baz' ];
        expect(include(attributes, including)).toEqual({ baz: true });
    });

    it('should return attributes when no usable attributes are given', () => {
        expect(exclude(expected, [ 'baz', 'data-foo' ])).toEqual(expected);
        expect(include(expected, [ 'bar' ])).toEqual({ bar: 1 });

        expect(exclude(null, [ 'foo' ])).toBeNull();
        expect(exclude({}, [ 'foo' ])).toEqual({});
        expect(include(null, [ 'foo' ])).toBeNull();
        expect(include({}, [ 'foo' ])).toEqual({});
    });

    it('should not filter when no usable exclude is given', () => {
        expect(exclude(expected, null)).toEqual(expected);
        expect(exclude(expected, [])).toEqual(expected);
        expect(include(expected, null)).toEqual(expected);
        expect(include(expected, [])).toEqual({});
    });
});
