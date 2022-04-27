import TextCounter from '@/components/form/fields/additions/counter/text-counter.vue';
import { MountedComponent } from '@test/types';
import { DOMWrapper, mount } from '@vue/test-utils';
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
        const { element } = mountComponent();

        expect(element.exists()).toBeTruthy();
        expect(element.text()).toBe('0 / 5');
    });

    it('should mount the component with the given type', async () => {
        const { element } = mountComponent({ type: 'word' });

        expect(element.exists()).toBeTruthy();
        expect(element.text()).toBe('0 / 5');
    });

    it('should mount the component with a default value', async () => {
        const { element } = mountComponent({ value: 'foo' });

        expect(element.exists()).toBeTruthy();
        expect(element.text()).toBe('3 / 5');
    });
});

describe('Counting characters', () => {

    it('should update the value from props', async () => {
        const { element, wrapper } = mountComponent({ value: 'foo' });
        expect(element.text()).toBe('3 / 5');

        await wrapper.setProps({ value: 'f' });
        expect(element.text()).toBe('1 / 5');
    });

    it('should set the exceeded class if count is over the limit', async () => {
        const { element, wrapper } = mountComponent({ value: 'foo' });
        expect(element.text()).toBe('3 / 5');

        await wrapper.setProps({ value: 'foobar' });
        expect(element.text()).toBe('6 / 5');

        expect(element.classes().includes('exceeded')).toBeTruthy();
    });
});

describe('Counting words', () => {

    it('should update the value from props', async () => {
        const { element, wrapper } = mountComponent({ type: 'word', value: 'foo' });
        expect(element.text()).toBe('1 / 5');

        await wrapper.setProps({ type: 'word', value: 'foo bar' });
        expect(element.text()).toBe('2 / 5');
    });

    it('should set the exceeded class if count is over the limit', async () => {
        const { element, wrapper } = mountComponent({ type: 'word', value: 'foo', limit: 2 });
        expect(element.text()).toBe('1 / 2');

        await wrapper.setProps({ type: 'word', value: 'foo bar baz' });
        expect(element.text()).toBe('3 / 2');

        expect(element.classes().includes('exceeded')).toBeTruthy();
    });
});

function mountComponent(props: { [key: string]: any } = null): MountedComponent {
    const options = {
        props: Object.assign({}, counterProps, props || null)
    };

    const wrapper = mount(TextCounter, options);
    const element = wrapper.find('.counter') as DOMWrapper<HTMLElement>;

    return { wrapper, element };
}
