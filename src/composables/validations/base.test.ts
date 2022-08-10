import { FieldData } from '@/composables/types';
import { maximum, minimum, required } from '@/composables/validations/base';
import { describe, expect, it } from 'vitest';

const data: FieldData = {
    name: 'strings',
    value: 'some value'
};

const empty: FieldData = { name: 'empty', value: '' };

const length = (<string> data.value).length;

describe('Validate required', () => {

    it('should validate given values', () => {
        expect(required(data, true)).toBe(true);
        expect(required(data)).toBe(true);
    });

    it('should validate if required is false', () => {
        expect(required(data, false)).toBe(true);
        expect(required({} as FieldData, false)).toBe(true);
    });

    it('should not validate if value is incorrect', () => {
        expect(required(empty)).toBe(false);
        expect(required({} as FieldData)).toBe(false);
    });
});

describe('Validate minimum length', () => {

    it('should validate given value', () => {
        expect(minimum(data, 3)).toBe(true);
        expect(minimum(data, length)).toBe(true);
    });

    it('should validate if amount is falsy', () => {
        expect(minimum(data, 0)).toBe(true);
        expect(minimum({} as FieldData, 0)).toBe(true);
    });

    it('should not validate if data is under the minimum', () => {
        expect(minimum(empty, 2)).toBe(false);
        expect(minimum(data, length + 1)).toBe(false);
    });
});

describe('Validate maximum length', () => {

    it('should validate given values', () => {
        expect(maximum(data, length + 1)).toBe(true);
        expect(maximum(data, length)).toBe(true);
    });

    it('should validate if value is empty', () => {
        expect(maximum(empty, 0)).toBe(true);
    });

    it('should validate if amount is falsy', () => {
        expect(maximum(data, 0)).toBe(true);
        expect(maximum(empty, 0)).toBe(true);
        expect(maximum({} as FieldData, 0)).toBe(true);
    });

    it('should not validate if data is above the maximum', () => {
        expect(maximum(data, length - 1)).toBe(false);
    });
});
