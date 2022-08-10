import { filter, shorten, transform } from '@/util/strings';
import { describe, expect, it } from 'vitest';

const value = 'Some value with number 123 in it';

describe('Filter value', () => {

    it('should filter out values not in the regex', () => {
        expect(filter(value, 'number 123')).toEqual('number 123');
        expect(filter(value, /[A-z ]*/g)).toEqual('Some value with number  in it');
        expect(filter(value, new RegExp('[A-z ]*', 'g'))).toEqual('Some value with number  in it');
        expect(filter(value, new RegExp('[0-9]*', 'g'))).toEqual('123');
    });

    it('should not filter if the value matches the regex', () => {
        expect(filter(value, value)).toEqual(value);
        expect(filter(value, /[A-z0-9 ]*/g)).toEqual(value);
        expect(filter(value, new RegExp('[A-z0-9 ]*', 'g'))).toEqual(value);
    });

    it('should return an empty string if value does not match the regex', () => {
        expect(filter(value, 'zzz')).toEqual('');
    });

    it('should return the value if there is no regex', () => {
        expect(filter(value, '')).toEqual(value);
    });

    it('should return null if there is no value', () => {
        expect(filter('', /[A-z ]*/g)).toBeNull();
    });
});

describe('Transform value', () => {

    it('should uppercase given value', () => {
        expect(transform(value, 'uppercase')).toEqual(value.toUpperCase());
    });

    it('should lowercase given value', () => {
        expect(transform(value, 'lowercase')).toEqual(value.toLowerCase());
    });

    it('should return null if there is no value', () => {
        expect(transform('', 'uppercase')).toBeNull();
    });
});

describe('Shorten value', () => {

    it('should shorten given value', () => {
        expect(shorten(value, 10)).toEqual('Some value');
    });

    it('should return the value if no length', () => {
        expect(shorten(value, null)).toEqual(value);
    });

    it('should return null if there is no value', () => {
        expect(shorten('', 10)).toBeNull();
    });
});

