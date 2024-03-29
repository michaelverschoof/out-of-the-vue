import Modal from '@/components/modal.vue';
import { emitted } from '@test/emits';
import { ProvidedSlots } from '@test/types';
import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

/**
 * @vitest-environment jsdom
 * Used instead of happy-dom to get the `document.activeElement` working
 */

const opener = {
    opener: `<template #opener="{ open }">
                 <button id="opener" @click="open">Opener</button>
             </template>`
};

const content = {
    header: `<template #header="{ close }">
                 <button id="header" @click="close">Header</button>
             </template>`,
    default: `<template #default="{ close }">
                 <button id="content" @click="close">Content</button>
             </template>`,
    footer: `<template #footer="{ close }">
                 <button id="footer" @click="close">Footer</button>
             </template>`
};

const all = Object.assign({}, opener, content);

beforeAll(() => {
    expect(Modal).toBeTruthy();
});

beforeEach(() => {
    const parent = document.createElement('div');
    parent.id = 'parent';
    document.body.appendChild(parent);
});

afterEach(() => {
    document.body.outerHTML = '';
});

describe('Mounting components', () => {
    it('should mount the component', async () => {
        const wrapper = await mountComponent();
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should mount the component with an opener', async () => {
        const wrapper = await mountComponent(opener);
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should mount the component in opened state', async () => {
        const wrapper = await mountComponent(all, true);
        const modal = await getModalElement(wrapper);
        expect(modal).toMatchSnapshot();
    });

    it('should mount the component in opened state without a header and footer', async () => {
        const wrapper = await mountComponent({ default: all.default }, true);
        const modal = await getModalElement(wrapper);
        expect(modal).toMatchSnapshot();
    });
});

describe('Opening and closing modal', async () => {
    it('should open using opener', async () => {
        const wrapper = await mountComponent(all);

        let modal = await getModalElement(wrapper);
        expect(modal).not.toMatchSnapshot();

        await wrapper.find('#opener').trigger('click');
        expect(modal).toMatchSnapshot();

        await wrapper.vm.$nextTick();

        const backdrop = document.querySelector('.backdrop') as HTMLDivElement;
        expect(backdrop).toBe(document.activeElement);

        emitted(wrapper, 'opened');
    });

    it('should open using prop', async () => {
        const wrapper = await mountComponent(all);

        const modal = await getModalElement(wrapper);
        expect(modal).not.toMatchSnapshot();

        await wrapper.setProps({ open: true });
        expect(modal).toMatchSnapshot();

        emitted(wrapper, 'opened');
    });

    it('should not open using prop if already opened', async () => {
        const wrapper = await mountComponent(all);

        let modal = await getModalElement(wrapper);
        expect(modal).not.toMatchSnapshot();

        await wrapper.find('#opener').trigger('click');
        expect(modal).toMatchSnapshot();

        await wrapper.setProps({ open: true });
        modal = await getModalElement(wrapper);
        expect(modal).toMatchSnapshot();

        emitted(wrapper, 'opened', 1);
    });

    it('should close using prop', async () => {
        const wrapper = await mountComponent(all, true);

        const modal = await getModalElement(wrapper);
        expect(modal).toMatchSnapshot();

        await wrapper.setProps({ open: false });
        expect(modal).not.toMatchSnapshot();

        emitted(wrapper, 'closed');
    });

    it('should close using header', async () => {
        const wrapper = await mountComponent(all, true);

        let modal = await getModalElement(wrapper);
        (<HTMLButtonElement>modal.querySelector('#header')).click();

        modal = await getModalElement(wrapper);
        expect(modal).toBeNull();

        emitted(wrapper, 'closed');
    });

    it('should close using content', async () => {
        const wrapper = await mountComponent(all, true);

        let modal = await getModalElement(wrapper);
        (<HTMLButtonElement>modal.querySelector('#content')).click();

        modal = await getModalElement(wrapper);
        expect(modal).toBeNull();

        emitted(wrapper, 'closed');
    });

    it('should close using footer', async () => {
        const wrapper = await mountComponent(all, true);

        let modal = await getModalElement(wrapper);
        (<HTMLButtonElement>modal.querySelector('#footer')).click();

        modal = await getModalElement(wrapper);
        expect(modal).toBeNull();

        emitted(wrapper, 'closed');
    });

    it('should close using backdrop', async () => {
        const wrapper = await mountComponent(all, true);

        let modal = await getModalElement(wrapper);
        expect(modal).not.toBeNull();

        const backdrop = document.querySelector('.backdrop') as HTMLDivElement;
        backdrop.click();

        modal = await getModalElement(wrapper);
        expect(modal).toBeNull();

        emitted(wrapper, 'closed');
    });

    it('should close using escape button', async () => {
        const wrapper = await mountComponent(all, true);

        let modal = await getModalElement(wrapper);
        expect(modal).not.toBeNull();

        const backdrop = document.querySelector('.backdrop') as HTMLDivElement;
        backdrop.focus();

        const keyPress = new KeyboardEvent('keydown', { key: 'esc' });
        backdrop.dispatchEvent(keyPress);

        modal = await getModalElement(wrapper);
        expect(modal).toBeNull();

        emitted(wrapper, 'closed');
    });
});

it('should unmount the component', async () => {
    const wrapper = await mountComponent();
    expect(wrapper.html()).toMatchSnapshot();

    wrapper.unmount();
    expect(wrapper.html()).not.toMatchSnapshot();
});

async function mountComponent(slots?: ProvidedSlots, open: boolean = false): Promise<VueWrapper<any>> {
    return mount(Modal, {
        props: { parent: '#parent', open: open },
        slots: slots,
        attachTo: document.body
    });
}

async function getModalElement(wrapper: VueWrapper<any>): Promise<HTMLDivElement> {
    await wrapper.vm.$nextTick();
    return document.querySelector('.modal') as HTMLDivElement;
}
