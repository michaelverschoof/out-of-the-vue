import { DOMWrapper, VueWrapper } from '@vue/test-utils';

type renderFunction = (type: symbol, props?: null, children?: string | number | boolean) => any;

export interface ProvidedSlots {
    [name: string]: string | renderFunction;
}

export interface MountedComponent {
    wrapper: VueWrapper<any>,
    element?: DOMWrapper<HTMLElement>
}
