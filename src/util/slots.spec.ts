import { filter, provided } from '@/util/slots';
import { VNode } from '@vue/runtime-core';
import { describe, expect, it } from 'vitest';
import { Slot } from 'vue';

describe('Provided slots', () => {
    const slot: Slot = (): VNode[] => {
        return [ {
            children: 'some slot content'
        } ] as VNode[];
    };

    it('should be true when providing a valid slot', () => {
        expect(provided(slot)).toBe(true);
    });

    it('should be false when providing no usable slot value', () => {
        expect(provided(null)).toBe(false);

        let slot: Slot = (): VNode[] => [] as VNode[];
        expect(provided(slot)).toBe(false);

        slot = (): VNode[] => [ { children: null } ] as VNode[];
        expect(provided(slot)).toBe(false);
    });
});

describe('Filter slots', () => {
    const slot1 = (): VNode[] => [ { children: 'some slot content' } ] as VNode[];
    const slot2 = (): VNode[] => [ { children: 'some other slot content' } ] as VNode[];
    const slots = { foo: slot1, bar: slot2 };

    it('should filter the given slot', () => {
        expect(filter(slots, [ 'foo' ])).toEqual({ bar: slot2 });
    });

    it('should not filter when no valid excludes are given', () => {
        expect(filter(slots, [ 'baz' ])).toEqual(slots);
        expect(filter(slots, null)).toEqual(slots);
        expect(filter(slots, [])).toEqual(slots);
    });

    it('should return slots when slots is null or empty', () => {
        expect(filter(null, [ 'baz' ])).toEqual(null);
        expect(filter({}, [ 'baz' ])).toEqual({});
    });
});
