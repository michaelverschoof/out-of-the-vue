import { provided } from '@/util/slots';
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
