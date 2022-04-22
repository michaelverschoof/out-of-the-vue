import PrependAppend from '@/components/form/fields/additions/layout/prepend-append.vue';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
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
        const { wrapper } = mountComponent({ prepend: 'Bar' });
        expect(wrapper.find('.prepend-append').exists()).toBeTruthy();
        expect(wrapper.find('.prepend-append .prepend').exists()).toBeTruthy();
    });

    it('should have the append element', async () => {
        const { wrapper } = mountComponent({ append: 'Baz' });
        expect(wrapper.find('.prepend-append').exists()).toBeTruthy();
        expect(wrapper.find('.prepend-append .append').exists()).toBeTruthy();
    });

    it('should have both elements', async () => {
        const { wrapper } = mountComponent({ prepend: 'Bar', append: 'Baz' });
        expect(wrapper.find('.prepend-append').exists()).toBeTruthy();
        expect(wrapper.find('.prepend-append .prepend').exists()).toBeTruthy();
        expect(wrapper.find('.prepend-append .append').exists()).toBeTruthy();
    });
});

type renderFunction = (type: symbol, props?: null, children?: string | number | boolean) => any;

function mountComponent(slots?: { [name: string]: string | renderFunction }): { wrapper: VueWrapper<any>, prepend: DOMWrapper<HTMLSpanElement> } {
    const defaultSlot = { default: 'Foo' };

    const wrapper = mount(PrependAppend, { slots: Object.assign(defaultSlot, slots) });
    if (!slots || !Object.keys(slots).some(name => [ 'prepend', 'append' ].includes(name))) {
        return { wrapper, prepend: null };
    }

    const prepend = wrapper.find('.prepend-append') as DOMWrapper<HTMLSpanElement>;
    return { wrapper, prepend };
}
