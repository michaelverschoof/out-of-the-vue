import PrependAppend from '@/components/form/fields/additions/layout/prepend-append.vue';
import { MountedComponent, ProvidedSlots } from '@test/types';
import { DOMWrapper, mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * @vitest-environment happy-dom
 */

beforeAll(() => {
    expect(PrependAppend).toBeTruthy();
});

describe('Mounting component', () => {

    it('should mount the component', async () => {
        const { wrapper } = mountComponent();
        expect(wrapper.html()).toBe('Foo');
    });

    it('should not mount anything if no slots are provided', async () => {
        const wrapper = mount(PrependAppend, { slots: null });
        expect(wrapper.html()).toBe('');
        expect(wrapper.element.children).toHaveLength(0);
    });
});

describe('Filling slots', () => {

    it('should have the prepend element', async () => {
        const { element } = mountComponent({ prepend: 'Bar' });

        expect(element.exists()).toBeTruthy();
        expect(element.find('.prepend').exists()).toBeTruthy();
    });

    it('should have the append element', async () => {
        const { element } = mountComponent({ append: 'Baz' });

        expect(element.exists()).toBeTruthy();
        expect(element.find('.append').exists()).toBeTruthy();
    });

    it('should have both elements', async () => {
        const { element } = mountComponent({ prepend: 'Bar', append: 'Baz' });
        expect(element.exists()).toBeTruthy();
        expect(element.find('.prepend').exists()).toBeTruthy();
        expect(element.find('.append').exists()).toBeTruthy();
    });
});

function mountComponent(slots?: ProvidedSlots): MountedComponent {
    const defaultSlot = { default: 'Foo' };

    const wrapper = mount(PrependAppend, { slots: Object.assign(defaultSlot, slots) });
    if (!slots || !Object.keys(slots).some(name => [ 'prepend', 'append' ].includes(name))) {
        return { wrapper, element: null };
    }

    const element = wrapper.find('.prepend-append') as DOMWrapper<HTMLSpanElement>;
    return { wrapper, element };
}
