import { Slot } from 'vue';

/**
 * Check if a slot has any content provided
 * @param slot the slot to check
 */
export function provided(slot?: Slot) {
    if (!slot || !slot()[0]) {
        return false;
    }

    return !!slot()[0].children?.length;
}
