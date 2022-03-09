import { Slot } from 'vue';

export function providedSlot(slot: Slot) {
    return !!slot()[0].children.length;
}
