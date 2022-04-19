import { FieldData } from '@/composables/types';
import { maximum, minimum } from '@/composables/validations/amount';
import { describe, expect, it } from 'vitest';

const amount: FieldData = {
    name: 'amount',
    value: 123
};

const negative: FieldData = {
    name: 'negative',
    value: -123
};

const empty = {} as FieldData;

describe('Validate minimum amount', () => {

    it('should validate given amounts', () => {
        expect(minimum(amount, 10)).toBe(true);
        expect(minimum(amount, 123)).toBe(true);
        expect(minimum(amount, -10)).toBe(true);
        expect(minimum(negative, -123)).toBe(true);
        expect(minimum(empty, 0)).toBe(true);
    });

    it('should not validate if data is under the minimum', () => {
        expect(minimum(amount, 321)).toBe(false);
        expect(minimum({} as FieldData, 321)).toBe(false);
        expect(minimum(null, 321)).toBe(false);
        expect(minimum(negative, -10)).toBe(false);
        expect(minimum(empty, 10)).toBe(false);
    });

    it('should validate if minimum is falsy', () => {
        expect(minimum(amount, 0)).toBe(true);
        expect(minimum(amount, null)).toBe(true);
        expect(minimum(negative, null)).toBe(true);

        expect(minimum(empty, 0)).toBe(true);
        expect(minimum(null, 0)).toBe(true);
    });
});

describe('Validate maximum amount', () => {

    it('should validate given amounts', () => {
        expect(maximum(amount, 321)).toBe(true);
        expect(maximum(amount, 123)).toBe(true);
        expect(maximum(negative, -10)).toBe(true);
        expect(maximum(negative, -123)).toBe(true);
        expect(maximum(empty, 123)).toBe(true);
    });

    it('should not validate if data is above the maximum', () => {
        expect(maximum(amount, 100)).toBe(false);
        expect(maximum(negative, -321)).toBe(false);
        expect(maximum(empty, -321)).toBe(false);
    });

    it('should validate if maximum is falsy', () => {
        expect(maximum(amount, 0)).toBe(true);
        expect(maximum(amount, null)).toBe(true);
        expect(maximum(negative, null)).toBe(true);

        expect(maximum(empty, 0)).toBe(true);
        expect(maximum(null, 0)).toBe(true);
    });
});
