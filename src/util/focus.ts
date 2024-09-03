import { Ref, isRef } from 'vue';

type FocusableElement = HTMLElement | Ref<HTMLElement>;

/**
 * Check if an element in the list contains the active element
 *
 * @param elements the list of elements to check
 */
export function hasFocus(...elements: FocusableElement[]): boolean {
    if (!elements || !elements.length) {
        return false;
    }

    const activeElement = document.activeElement;

    return getHTMLElements(elements).some((element) => !!element && (element === activeElement || element.contains(activeElement)));
}

function getHTMLElements(elements: FocusableElement[]): HTMLElement[] {
    return elements.map<HTMLElement>((element) => (isRef(element) ? (<Ref<HTMLElement>>element).value : <HTMLElement>element));
}
