import Modal from '@/v2/components/containment/modal.vue';
import { emittedCustomEvents } from '@test/emits';
import { ProvidedSlots } from '@test/types';
import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';

/**
 * @vitest-environment happy-dom
 */

const activator = {
    activator: `<template #activator="{ open }">
                 <button id="activator" @click="open">activator</button>
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

const globals = {
    stubs: {
        teleport: true
    }
};

const templates = Object.assign({}, activator, content);

beforeAll(() => {
    expect(Modal).toBeTruthy();
});

describe('Mounting components', () => {
    it('should mount the component', async () => {
        const wrapper = await mountComponent();

        expect(wrapper.find('.modal').exists()).toBeFalsy();

        emittedCustomEvents(wrapper, 'opened', 0);
    });

    it('should mount the component with an activator', async () => {
        const wrapper = await mountComponent(activator);

        expect(wrapper.find('#activator').exists()).toBeTruthy();
        expect(wrapper.find('.modal').exists()).toBeFalsy();

        emittedCustomEvents(wrapper, 'opened', 0);
    });

    it('should mount the component in opened state', async () => {
        const wrapper = await mountComponent({ default: templates.default }, true);

        const modal = wrapper.find('.modal');
        expect(modal.isVisible()).toBeTruthy();

        expect(modal.find('header').exists()).toBeFalsy();
        expect(modal.find('footer').exists()).toBeFalsy();

        const main = modal.find('main');
        expect(main.isVisible()).toBeTruthy();
        expect(main.text()).toEqual('Content');

        emittedCustomEvents(wrapper, 'opened', 1);
    });

    it('should mount the component in opened state with all templates', async () => {
        const wrapper = await mountComponent(templates, true);

        const modal = wrapper.find('.modal');
        expect(modal.isVisible()).toBeTruthy();

        const header = modal.find('header');
        expect(header.isVisible()).toBeTruthy();
        expect(header.text()).toEqual('Header');

        const main = modal.find('main');
        expect(main.isVisible()).toBeTruthy();
        expect(main.text()).toEqual('Content');

        const footer = modal.find('footer');
        expect(footer.isVisible()).toBeTruthy();
        expect(footer.text()).toEqual('Footer');

        emittedCustomEvents(wrapper, 'opened', 1);
    });
});

describe('Opening modal', async () => {
    it('should open using activator', async () => {
        const wrapper = await mountComponent(templates);

        expect(wrapper.find('.modal').exists()).toBeFalsy();

        const activator = wrapper.find('#activator');
        expect(activator.exists()).toBeTruthy();

        await activator.trigger('click');

        const modal = wrapper.find('.modal');
        expect(modal.exists()).toBeTruthy();
        expect(modal.isVisible()).toBeTruthy();

        emittedCustomEvents(wrapper, 'opened', 1);
    });

    it('should open using model value', async () => {
        const wrapper = await mountComponent(templates);

        expect(wrapper.find('.modal').exists()).toBeFalsy();

        await wrapper.setProps({ modelValue: true });

        const modal = wrapper.find('.modal');
        expect(modal.exists()).toBeTruthy();
        expect(modal.isVisible()).toBeTruthy();

        // As we open the modal via the model, the openModal function is not triggered
        emittedCustomEvents(wrapper, 'opened', 0);
    });

    it('should open using function', async () => {
        const wrapper = mount(
            defineComponent({
                components: { Modal },
                template: `<modal ref="element">Testing modal</modal>`
            }),
            {
                attachTo: document.body,
                global: { ...globals }
            }
        );

        expect(wrapper.find('.modal').exists()).toBeFalsy();

        const component = wrapper.findComponent({ ref: 'element' });
        await component.vm.open();

        await wrapper.vm.$nextTick();

        const modal = wrapper.find('.modal');
        expect(modal.exists()).toBeTruthy();
        expect(modal.isVisible()).toBeTruthy();

        // Test against the custom component as the emit isn't propagated to the main wrapper
        emittedCustomEvents(component, 'opened', 1);
    });

    it('should not open if already opened', async () => {
        const wrapper = await mountComponent(templates);

        expect(wrapper.find('.modal').exists()).toBeFalsy();

        const activator = wrapper.find('#activator');
        expect(activator.exists()).toBeTruthy();

        await activator.trigger('click');

        const modal = wrapper.find('.modal');
        expect(modal.exists()).toBeTruthy();
        expect(modal.isVisible()).toBeTruthy();

        emittedCustomEvents(wrapper, 'opened');

        await activator.trigger('click');

        expect(modal.exists()).toBeTruthy();
        expect(modal.isVisible()).toBeTruthy();

        emittedCustomEvents(wrapper, 'opened', 1);
    });
});

describe('Closing modal', async () => {
    it('should close using header', async () => {
        const wrapper = await mountComponent({ header: templates.header }, true);

        expect(wrapper.find('.modal').isVisible()).toBeTruthy();
        emittedCustomEvents(wrapper, 'opened', 1);

        await wrapper.find('#header').trigger('click');
        expect(wrapper.find('.modal').exists()).toBeFalsy();

        emittedCustomEvents(wrapper, 'closed', 1);
    });

    it('should close using content', async () => {
        const wrapper = await mountComponent({ default: templates.default }, true);

        expect(wrapper.find('.modal').isVisible()).toBeTruthy();
        emittedCustomEvents(wrapper, 'opened', 1);

        await wrapper.find('#content').trigger('click');
        expect(wrapper.find('.modal').exists()).toBeFalsy();

        emittedCustomEvents(wrapper, 'closed', 1);
    });

    it('should close using footer', async () => {
        const wrapper = await mountComponent({ footer: templates.footer }, true);

        expect(wrapper.find('.modal').isVisible()).toBeTruthy();
        emittedCustomEvents(wrapper, 'opened', 1);

        await wrapper.find('#footer').trigger('click');
        expect(wrapper.find('.modal').exists()).toBeFalsy();

        emittedCustomEvents(wrapper, 'closed', 1);
    });

    it('should close using backdrop', async () => {
        const wrapper = await mountComponent({ default: templates.default }, true);

        expect(wrapper.find('.modal').isVisible()).toBeTruthy();
        emittedCustomEvents(wrapper, 'opened', 1);

        await wrapper.find('.backdrop').trigger('click');
        expect(wrapper.find('.modal').exists()).toBeFalsy();

        emittedCustomEvents(wrapper, 'closed', 1);
    });

    it('should close using escape button', async () => {
        const wrapper = await mountComponent({ default: templates.default }, true);

        expect(wrapper.find('.modal').isVisible()).toBeTruthy();
        emittedCustomEvents(wrapper, 'opened', 1);

        const keyPress = new KeyboardEvent('keydown', { key: 'esc' });
        await wrapper.find('.backdrop').element.dispatchEvent(keyPress);

        emittedCustomEvents(wrapper, 'closed', 1);
    });

    it('should close using model value', async () => {
        const wrapper = await mountComponent({ default: templates.default }, true);

        expect(wrapper.find('.modal').isVisible()).toBeTruthy();
        emittedCustomEvents(wrapper, 'opened', 1);

        await wrapper.setProps({ modelValue: false });

        expect(wrapper.find('.modal').exists()).toBeFalsy();
        emittedCustomEvents(wrapper, 'closed', 1);
    });

    it('should close using function', async () => {
        const wrapper = mount(
            defineComponent({
                components: { Modal },
                template: `<modal ref="element">Testing modal</modal>`
            }),
            {
                props: { modelValue: true },
                attachTo: document.body,
                global: { ...globals }
            }
        );

        await wrapper.vm.$nextTick();

        const modal = wrapper.find('.modal');
        expect(modal.exists()).toBeTruthy();
        expect(modal.isVisible()).toBeTruthy();

        const component = wrapper.findComponent({ ref: 'element' });

        // Test against the custom component as the emit isn't propagated to the wrapper
        emittedCustomEvents(component, 'opened');

        await component.vm.close();
        expect(wrapper.find('.modal').exists()).toBeFalsy();

        // Test against the custom component as the emit isn't propagated to the wrapper
        emittedCustomEvents(component, 'closed', 1);
    });

    it('should not close if already closed', async () => {
        const wrapper = mount(
            defineComponent({
                components: { Modal },
                template: `<modal ref="element">Testing modal</modal>`
            }),
            {
                props: { modelValue: true },
                attachTo: document.body,
                global: { ...globals }
            }
        );

        await wrapper.vm.$nextTick();

        const modal = wrapper.find('.modal');
        expect(modal.exists()).toBeTruthy();
        expect(modal.isVisible()).toBeTruthy();

        const component = wrapper.findComponent({ ref: 'element' });

        // Test against the custom component as the emit isn't propagated to the wrapper
        emittedCustomEvents(component, 'opened');

        await component.vm.close();
        expect(wrapper.find('.modal').exists()).toBeFalsy();

        // Test against the custom component as the emit isn't propagated to the wrapper
        emittedCustomEvents(component, 'closed');

        await component.vm.close();
        expect(wrapper.find('.modal').exists()).toBeFalsy();

        // Test against the custom component as the emit isn't propagated to the wrapper
        emittedCustomEvents(component, 'closed', 1);
    });
});

async function mountComponent(slots?: ProvidedSlots, open: boolean = false) {
    const wrapper = mount(Modal, {
        props: {
            parent: '#parent',
            modelValue: open ? true : undefined,
            'onUpdate:modelValue': (value: boolean) => wrapper.setProps({ modelValue: value })
        },
        slots: slots,
        attachTo: document.body,
        global: { ...globals }
    });

    return wrapper;
}
