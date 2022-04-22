import TextCounter from '@/components/form/fields/additions/counter/text-counter.vue';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * @vitest-environment happy-dom
 */

const counterProps = {
    limit: 5
};

beforeAll(() => {
    expect(TextCounter).toBeTruthy();
});

describe('Mounting components', () => {

    it('should mount the component', async () => {
        const { counter } = mountComponent();

        expect(counter.exists()).toBeTruthy();
        expect(counter.text()).toBe('0 / 5');
    });

    it('should mount the component with the given type', async () => {
        const { counter } = mountComponent({ type: 'word' });

        expect(counter.exists()).toBeTruthy();
        expect(counter.text()).toBe('0 / 5');
    });

    it('should mount the component with a default value', async () => {
        const { counter } = mountComponent({ value: 'foo' });

        expect(counter.exists()).toBeTruthy();
        expect(counter.text()).toBe('3 / 5');
    });
});

describe('Counting characters', () => {

    it('should update the value from props', async () => {
        const { counter, wrapper } = mountComponent({ value: 'foo' });
        expect(counter.text()).toBe('3 / 5');

        await wrapper.setProps({ value: 'f' });
        expect(counter.text()).toBe('1 / 5');
    });

    it('should set the exceeded class if count is over the limit', async () => {
        const { counter, wrapper } = mountComponent({ value: 'foo' });
        expect(counter.text()).toBe('3 / 5');

        await wrapper.setProps({ value: 'foobar' });
        expect(counter.text()).toBe('6 / 5');

        expect(counter.classes().includes('exceeded')).toBeTruthy();
    });
});

describe('Counting words', () => {

    it('should update the value from props', async () => {
        const { counter, wrapper } = mountComponent({ type: 'word', value: 'foo' });
        expect(counter.text()).toBe('1 / 5');

        await wrapper.setProps({ type: 'word', value: 'foo bar' });
        expect(counter.text()).toBe('2 / 5');
    });

    it('should set the exceeded class if count is over the limit', async () => {
        const { counter, wrapper } = mountComponent({ type: 'word', value: 'foo', limit: 2 });
        expect(counter.text()).toBe('1 / 2');

        await wrapper.setProps({ type: 'word', value: 'foo bar baz' });
        expect(counter.text()).toBe('3 / 2');

        expect(counter.classes().includes('exceeded')).toBeTruthy();
    });
});

function mountComponent(props: { [key: string]: any } = null): { wrapper: VueWrapper<any>, counter: DOMWrapper<HTMLElement> } {
    const options = {
        props: Object.assign({}, counterProps, props || null)
    };

    const wrapper = mount(TextCounter, options);
    const counter = wrapper.find('.counter') as DOMWrapper<HTMLElement>;

    return { wrapper, counter };
}
