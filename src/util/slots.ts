import { Slots, VNode } from '@vue/runtime-core';
import { Slot } from 'vue';

export function provided(slot: Slot) {
    return !!slot()[0].children.length;
}

type ExternalSlots = { [name: string]: (...args: any[]) => VNode[] }

export function filter(slots: Slots, filters: string[]): Slots {
    return Object.keys(slots)
    .filter(key => !filters.includes(key))
    .reduce((result: ExternalSlots, key: string) => {
        result[key] = slots[key];
        return result;
    }, {} as Slots);
}
