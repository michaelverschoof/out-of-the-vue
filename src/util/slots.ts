import { Slot } from 'vue';

/**
 * Check if a slot has any content provided
 * @param slot the slot to check
 */
export function provided(slot?: Slot) {
    if (!slot || !slot().length) {
        return false;
    }

    return slot().some((content) => !!content.el || hasChildContent(content.children) || hasPropContent(content.props));
}

function hasChildContent(children: any): boolean {
    return !!children && !(children === 'v-if') && !!Object.keys(children).length;
}

function hasPropContent(props: any): boolean {
    return !!props && Object.keys(props).some((key) => key !== 'key');
}
