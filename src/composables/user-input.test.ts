import { useUserInput } from '@/composables/user-input';
import { describe, expect, it } from 'vitest';

const value = 'Some value with number 123 in it';

describe('Filter value', () => {
    const { filter } = useUserInput();

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
        expect(filter(value, null)).toEqual(value);
        expect(filter(value, undefined)).toEqual(value);
    });

    it('should return null if there is no value', () => {
        expect(filter('', /[A-z ]*/g)).toBeNull();
        expect(filter(null, /[A-z ]*/g)).toBeNull();
        expect(filter(undefined, /[A-z ]*/g)).toBeNull();
    });
});

describe('Transform value', () => {
    const { transform } = useUserInput();

    it('should uppercase given value', () => {
        expect(transform(value, 'uppercase')).toEqual(value.toUpperCase());
    });

    it('should lowercase given value', () => {
        expect(transform(value, 'lowercase')).toEqual(value.toLowerCase());
    });

    it('should lowercase if no type is given', () => {
        expect(transform(value, null)).toEqual(value.toLowerCase());
        expect(transform(value, undefined)).toEqual(value.toLowerCase());
    });

    it('should return null if there is no value', () => {
        expect(transform('', 'uppercase')).toBeNull();
        expect(transform(null, 'uppercase')).toBeNull();
        expect(transform(undefined, 'lowercase')).toBeNull();
    });
});
