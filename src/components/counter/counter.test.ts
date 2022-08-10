import Counter from '@/components/counter/counter.vue';
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
    expect(Counter).toBeTruthy();
});

describe('Mounting components', () => {

    it('should mount the component', async () => {
        const { element } = mountComponent();

        expect(element?.exists()).toBeTruthy();
        expect(element?.text()).toBe('0 / 5');
    });

    it('should mount the component without limit showing', async () => {
        const { element } = mountComponent({ limit: 0 });

        expect(element?.exists()).toBeTruthy();
        expect(element?.text()).toBe('0');
    });

    it('should mount the component as provided tag', async () => {
        const { element, wrapper } = mountComponent({ tag: 'div' });

        expect(element?.exists()).toBeTruthy();
        expect(element?.element).toEqual(wrapper.find('div').element);
    });

    it('should mount the component with a default value', async () => {
        const { element } = mountComponent({ count: 3 });

        expect(element?.exists()).toBeTruthy();
        expect(element?.text()).toBe('3 / 5');
    });
});

describe('Counting', () => {

    it('should update the value from props', async () => {
        const { element, wrapper } = mountComponent({ count: 3 });
        expect(element?.text()).toBe('3 / 5');

        await wrapper.setProps({ count: 1 });
        expect(element?.text()).toBe('1 / 5');
    });

    it('should set the exceeded class if count is over the limit', async () => {
        const { element, wrapper } = mountComponent({ count: 3 });
        expect(element?.text()).toBe('3 / 5');

        await wrapper.setProps({ count: 7 });
        expect(element?.text()).toBe('7 / 5');

        expect(element?.classes().includes('exceeded')).toBeTruthy();
    });

    it('should set the exceeded class if count is over the limit', async () => {
        const { element, wrapper } = mountComponent({ count: 7 });
        expect(element?.text()).toBe('7 / 5');
        expect(element?.classes().includes('exceeded')).toBeTruthy();

        await wrapper.setProps({ count: 3 });
        expect(element?.text()).toBe('3 / 5');
        expect(element?.classes().includes('exceeded')).toBeFalsy();
    });
});

function mountComponent(props: { [key: string]: string | number | null } | null = null): MountedComponent {
    const options = {
        props: Object.assign({}, counterProps, props)
    };

    const wrapper = mount(Counter, options);
    const element = wrapper.find('.counter') as DOMWrapper<HTMLElement>;

    return { wrapper, element };
}
