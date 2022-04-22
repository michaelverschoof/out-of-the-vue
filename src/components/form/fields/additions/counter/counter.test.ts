import Counter from '@/components/form/fields/additions/counter/counter.vue';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * @vitest-environment happy-dom
 */

const counterProps = {
    limit: 5
};

beforeAll(() => {
    expect(Counter).toBeTruthy();
});

describe('Mounting components', () => {

    it('should mount the component', async () => {
        const { counter } = mountComponent();

        expect(counter.exists()).toBeTruthy();
        expect(counter.text()).toBe('0 / 5');
    });

    it('should mount the component as provided tag', async () => {
        const { counter, wrapper } = mountComponent({ tag: 'div' });

        expect(counter.exists()).toBeTruthy();
        expect(counter.element).toEqual(wrapper.find('div').element);
    });

    it('should mount the component with a default value', async () => {
        const { counter } = mountComponent({ count: 3 });

        expect(counter.exists()).toBeTruthy();
        expect(counter.text()).toBe('3 / 5');
    });
});

describe('Counting', () => {

    it('should update the value from props', async () => {
        const { counter, wrapper } = mountComponent({ count: 3 });
        expect(counter.text()).toBe('3 / 5');

        await wrapper.setProps({ count: 1 });
        expect(counter.text()).toBe('1 / 5');
    });

    it('should set the exceeded class if count is over the limit', async () => {
        const { counter, wrapper } = mountComponent({ count: 3 });
        expect(counter.text()).toBe('3 / 5');

        await wrapper.setProps({ count: 7 });
        expect(counter.text()).toBe('7 / 5');

        expect(counter.classes().includes('exceeded')).toBeTruthy();
    });

    it('should set the exceeded class if count is over the limit', async () => {
        const { counter, wrapper } = mountComponent({ count: 7 });
        expect(counter.text()).toBe('7 / 5');
        expect(counter.classes().includes('exceeded')).toBeTruthy();

        await wrapper.setProps({ count: 3 });
        expect(counter.text()).toBe('3 / 5');
        expect(counter.classes().includes('exceeded')).toBeFalsy();
    });
});

function mountComponent(props: { [key: string]: any } = null): { wrapper: VueWrapper<any>, counter: DOMWrapper<HTMLElement> } {
    const options = {
        props: Object.assign({}, counterProps, props || null)
    };

    const wrapper = mount(Counter, options);
    const counter = wrapper.find('.counter') as DOMWrapper<HTMLElement>;

    return { wrapper, counter };
}
