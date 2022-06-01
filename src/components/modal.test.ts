import Modal from '@/components/modal.vue';
import { ProvidedSlots } from '@test/types';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';

// /**
//  * @vitest-environment happy-dom
//  */

beforeAll(() => {
    expect(Modal).toBeTruthy();
});

describe('Mounting components', () => {

    it('should mount the component', async () => {
        const { backdrop, modal, wrapper } = mountComponent();
        // expect(inputs.length).toBe(6);
        // expect(inputs.every(input => input.attributes().name.startsWith(props.name))).toBeTruthy();
        //
        // const emits = emitted(wrapper, 'created');
        // expect(emits[0]).toEqual(createdEmit);
    });
});

function mountComponent(props?: { parent?: string; opened?: number }, slots?: ProvidedSlots): { wrapper: VueWrapper<any>, backdrop: DOMWrapper<HTMLDivElement>, modal: DOMWrapper<HTMLDivElement> } {
    const wrapper = mount(Modal, {
        props: props,
        slots: slots,
        attachTo: document.body
    });

    const backdrop = wrapper.find('.backdrop') as DOMWrapper<HTMLDivElement>;
    const modal = wrapper.find('.modal') as DOMWrapper<HTMLDivElement>;

    // slots: {
    // default: `<template #default="{ debounce }">
    //                     <div @debounce="debounce(${ stringedData })">Foo</div>
    //                   </template>`
    // },

    return { wrapper, backdrop, modal };
}
