import NumericInput from '@/components/form/fields/base/numeric-input.vue';
import { emitted } from '@test/emits';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * @vitest-environment happy-dom
 */

const numberProps = {
    name: 'numeric-input',
    value: 123.45
};

beforeAll(() => {
    expect(NumericInput).toBeTruthy();
});

describe('Mounting component', () => {
    it('should mount the input component', async () => {
        const { input, wrapper } = mountComponent();

        expect(input.exists()).toBeTruthy();

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual(numberProps);
    });

    it('should mount the input component without a value', async () => {
        const { input, wrapper } = mountComponent({ value: null });

        expect(input.exists()).toBeTruthy();

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual({
            name: numberProps.name,
            value: null
        });
    });

    it('should mount the input component with decimals not allowed', async () => {
        const { input, wrapper } = mountComponent({ allowDecimals: false, value: 123 });

        expect(input.exists()).toBeTruthy();
        // @ts-ignore
        expect(input.element.attributes['inputmode']['value']).toBe('numeric');

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual({
            name: numberProps.name,
            value: 123
        });
    });

    it('should mount the input component with negative not allowed', async () => {
        const { input, wrapper } = mountComponent({ allowNegative: false });

        expect(input.exists()).toBeTruthy();

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual(numberProps);
    });
});

describe('Updating input', () => {
    it('should update value from props', async () => {
        const { input, wrapper } = mountComponent();

        await wrapper.setProps({ value: 456.78 });
        expect(input.element.value).toBe('456.78');

        await wrapper.setProps({ value: null });
        expect(input.element.value).toBe('');
    });

    it('should update value from input', async () => {
        const { input, wrapper } = mountComponent();

        await input.setValue('456.78');
        expect(input.element.value).toBe('456.78');

        const emits = emitted(wrapper, 'updated');
        expect(emits[0].value).toBe(456.78);
    });

    it('should not update value from props if equal to current value', async () => {
        const { input, wrapper } = mountComponent({ value: 123 });

        await input.setValue('456');
        expect(input.element.value).toBe('456');

        await wrapper.setProps({ value: 456 });
        expect(input.element.value).toBe('456');

        const created = emitted(wrapper, 'created');
        expect(created[0].value).toBe(123);

        const updated = emitted(wrapper, 'updated', 1);
        expect(updated[0].value).toBe(456);
    });

    it('should not update value from input if it is empty', async () => {
        const { input, wrapper } = mountComponent();

        await input.setValue('  ');
        expect(input.element.value).toBe('');

        const emits = emitted(wrapper, 'updated');
        expect(emits[0].value).toBe(null);
    });
});

function mountComponent(props: { [key: string]: number | boolean | null } | null = null): { wrapper: VueWrapper<any>; input: DOMWrapper<HTMLInputElement> } {
    const options = {
        props: Object.assign({}, numberProps, props || null)
    };

    const wrapper = mount(NumericInput, options);
    const input = wrapper.find('input');

    return { wrapper, input };
}
