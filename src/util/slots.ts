import { Slot } from 'vue';

/**
 * Check if a slot has any content provided
 * @param slot the slot to check
 */
export function provided(slot?: Slot) {
    if (!slot || !slot().length) {
        return false;
    }

    return slot().some(
        (content) =>
            !!content.el ||
            (!!content.children && !!Object.keys(content.children).length) ||
            (!!content.props && Object.keys(content.props).some((key) => key !== 'key'))
    );
}
