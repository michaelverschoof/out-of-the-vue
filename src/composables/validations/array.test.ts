import { FieldData } from '@/composables/types';
import { maximum, minimum, required } from '@/composables/validations/array';
import { describe, expect, it } from 'vitest';

const strings: FieldData = {
    name: 'strings',
    value: [ 'foo', 'bar', 'baz' ]
};

const numbers: FieldData = {
    name: 'numbers',
    value: [ 1, 2, 3, 4, 5 ]
};

const empty: FieldData = { name: 'empty', value: [] };

const lengthStrings = (<string[]> strings.value).length;
const lengthNumbers = (<number[]> numbers.value).length;

describe('Validate required', () => {

    it('should validate given arrays', () => {
        expect(required(strings, true)).toBe(true);
        expect(required(strings)).toBe(true);

        expect(required(numbers, true)).toBe(true);
        expect(required(numbers)).toBe(true);
    });

    it('should validate if required is false', () => {
        expect(required(strings, false)).toBe(true);
        expect(required(numbers, false)).toBe(true);

        expect(required({} as FieldData, false)).toBe(true);
    });

    it('should not validate if value is incorrect', () => {
        expect(required(empty)).toBe(false);
        expect(required({} as FieldData)).toBe(false);
    });
});

describe('Validate minimum array items', () => {

    it('should validate given arrays', () => {
        expect(minimum(strings, 2)).toBe(true);
        expect(minimum(strings, lengthStrings)).toBe(true);
        expect(minimum(numbers, 4)).toBe(true);
        expect(minimum(numbers, lengthNumbers)).toBe(true);
    });

    it('should validate if amount is falsy', () => {
        expect(minimum(strings, 0)).toBe(true);
        expect(minimum(numbers, 0)).toBe(true);

        expect(minimum({} as FieldData, 0)).toBe(true);
    });

    it('should not validate if data is under the minimum', () => {
        expect(minimum(empty, 2)).toBe(false);
        expect(minimum(strings, lengthStrings + 1)).toBe(false);
        expect(minimum(numbers, lengthNumbers + 1)).toBe(false);
    });
});

describe('Validate maximum array items', () => {

    it('should validate given arrays', () => {
        expect(maximum(strings, 3)).toBe(true);
        expect(maximum(strings, lengthStrings + 1)).toBe(true);
        expect(maximum(numbers, 7)).toBe(true);
        expect(maximum(numbers, lengthNumbers + 1)).toBe(true);
    });

    it('should validate if amount is falsy', () => {
        expect(maximum(strings, 0)).toBe(true);
        expect(maximum(numbers, 0)).toBe(true);

        expect(maximum({} as FieldData, 0)).toBe(true);
    });

    it('should not validate if data is above the maximum', () => {
        expect(maximum(strings, 2)).toBe(false);
        expect(maximum(strings, lengthStrings - 1)).toBe(false);
        expect(maximum(numbers, 4)).toBe(false);
        expect(maximum(numbers, lengthNumbers - 1)).toBe(false);
    });
});
