import { filter, parse } from '@/util/numbers';
import { describe, expect, it } from 'vitest';

describe('Parse string to number', () => {

    it('should return a valid number', () => {
        expect(parse('1234.56')).toBe(1234.56);
        expect(parse('1234,56')).toBe(1234.56);
        // expect(parse(slot)).toBe(true);
    });

    it('should return null when receiving an invalid value', () => {
        expect(parse(null)).toBe(null);
        expect(parse(undefined)).toBe(null);
        expect(parse('abcde')).toBe(null);
    });
});

describe('Filter string to parseable', () => {

    it('should return a valid number', () => {
        expect(filter('1234.56')).toBe('1234.56');
        expect(filter('1234,56')).toBe('1234,56');
        expect(filter('1,234.56')).toBe('1234.56');
        expect(filter('1.234,56')).toBe('1234,56');
        expect(filter('-1234.56')).toBe('-1234.56');
        expect(filter('-1234-56')).toBe('-123456');
    });

    it('should filter our all decimals', () => {
        expect(filter('1234.56', false)).toBe('123456');
        expect(filter('1234,56', false)).toBe('123456');
        expect(filter('1,234.56', false)).toBe('123456');
        expect(filter('1.234,56', false)).toBe('123456');
    });

    it('should filter our all minus signs', () => {
        expect(filter('-1234.56', true, false)).toBe('1234.56');
        expect(filter('-1234-56', false, false)).toBe('123456');
        expect(filter('-1,234-56', true, false)).toBe('1,23456');
        expect(filter('-1.234,56', false, false)).toBe('123456');
    });

    it('should return null when receiving an invalid value', () => {
        expect(filter(null)).toBe(null);
        expect(filter(undefined)).toBe(null);
        expect(filter('  ')).toBe(null);
    });
});
