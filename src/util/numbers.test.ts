import { parse } from '@/util/numbers';
import { expect, it } from 'vitest';

it('should return a valid number', () => {
    expect(parse('1234.56')).toBe(1234.56);
    expect(parse('1234,56')).toBe(1234.56);
    expect(parse('1,234.56')).toBe(1234.56);
    expect(parse('1.234,56')).toBe(1234.56);
    expect(parse('-1234.56')).toBe(-1234.56);
    expect(parse('-1234-56')).toBe(-123456);
});

it('should filter our all decimals', () => {
    expect(parse('1234.56', false)).toBe(123456);
    expect(parse('1234,56', false)).toBe(123456);
    expect(parse('1,234.56', false)).toBe(123456);
    expect(parse('1.234,56', false)).toBe(123456);
});

it('should filter our all minus signs', () => {
    expect(parse('-1234.56', true, false)).toBe(1234.56);
    expect(parse('-1234-56', false, false)).toBe(123456);
    expect(parse('-1,234-56', true, false)).toBe(1.23456);
    expect(parse('-1.234,56', false, false)).toBe(123456);
});

it('should return null when receiving an invalid value', () => {
    expect(parse('abcde')).toBe(null);
    expect(parse(null)).toBe(null);
    expect(parse(undefined)).toBe(null);
    expect(parse('  ')).toBe(null);
});
