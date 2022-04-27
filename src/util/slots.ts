import { Slots } from '@vue/runtime-core';
import { Slot } from 'vue';

type ExternalSlots = { [name: string]: Slot }

/**
 * Check if a slot has any content provided
 * @param slot the slot to check
 */
export function provided(slot: Slot) {
    if (!slot || !slot()[0]) {
        return false;
    }

    return !!slot()[0].children?.length;
}

/**
 * Filter slots by their name
 * @param slots the collection of slots to filter
 * @param exclude the slot names to filter out
 */
export function filter(slots: Slots, exclude: string[]): Slots {
    if (!slots || !exclude) {
        return slots;
    }

    return Object.keys(slots)
    .filter(key => !exclude.includes(key))
    .reduce((result: ExternalSlots, key: string) => {
        result[key] = slots[key];
        return result;
    }, {} as Slots);
}
