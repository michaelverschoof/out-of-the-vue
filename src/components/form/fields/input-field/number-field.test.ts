import NumberField from '@/components/form/fields/input-field/number-field.vue';
import { FieldData, ValidatedFieldData } from '@/composables/types';
import { emitted } from '@test/emits';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

/**
 * @vitest-environment happy-dom
 */

const props = {
    name: 'number-field'
};

const createdEmit: ValidatedFieldData = {
    name: props.name,
    value: null,
    valid: true,
    failed: []
};

vi.useFakeTimers();

beforeAll(() => {
    expect(NumberField).toBeTruthy();
});

afterEach(() => {
    vi.clearAllTimers();
});

describe('Mounting components', () => {

    it('should mount the component', async () => {
        const { input, wrapper } = mountComponent();

        expect(input.attributes().name).toBe(props.name);

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual(createdEmit);
    });

    it('should mount the component with prepend and append', async () => {
        const wrapper = mount(NumberField, {
            props: props,
            slots: { prepend: 'pre', append: 'post' }
        });

        const prepend = wrapper.find('.prepend');
        expect(prepend.exists()).toBeTruthy();
        expect(prepend.text()).toBe('pre');

        const append = wrapper.find('.append');
        expect(append.exists()).toBeTruthy();
        expect(append.text()).toBe('post');

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual(createdEmit);
    });

    it('should mount the component with label and information', async () => {
        const wrapper = mount(NumberField, {
            props: props,
            slots: { label: 'some label', information: 'some info' }
        });

        const label = wrapper.find('.label');
        expect(label.exists()).toBeTruthy();
        expect(label.text()).toBe('some label');

        const info = wrapper.find('.information');
        expect(info.exists()).toBeTruthy();
        expect(info.text()).toBe('some info');

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual(createdEmit);
    });
});

describe('Focusing components', () => {

    describe('On focus', () => {

        it('should focus natively', async () => {
            const wrapper = mount(NumberField, {
                props: props,
                attachTo: document.body
            });

            const input = wrapper.find('input');
            await input.element.focus();

            expect(input.element).toBe(document.activeElement);
            expect(wrapper.find('main').classes().includes('focused')).toBeTruthy();
        });

        it('should focus from prop', async () => {
            const wrapper = mount(NumberField, {
                props: props,
                attachTo: document.body
            });

            const input = wrapper.find('input');
            await wrapper.setProps({ focus: true });

            expect(input.element).toBe(document.activeElement);
            expect(wrapper.find('main').classes().includes('focused')).toBeTruthy();
        });
    });

    describe('On blur', () => {

        it('should blur natively', async () => {
            const wrapper = mount(NumberField, {
                props: props,
                attachTo: document.body
            });

            const input = wrapper.find('input');
            await input.element.focus();

            expect(input.element).toBe(document.activeElement);
            expect(wrapper.find('main').classes().includes('focused')).toBeTruthy();

            await input.element.blur();

            expect(input.element).not.toBe(document.activeElement);
            expect(wrapper.find('main').classes().includes('focused')).toBeFalsy();
        });

        it('should blur when prop changes', async () => {
            const wrapper = mount(NumberField, {
                props: props,
                attachTo: document.body
            });

            const input = wrapper.find('input');
            await wrapper.setProps({ focus: true });

            expect(input.element).toBe(document.activeElement);
            expect(wrapper.find('main').classes().includes('focused')).toBeTruthy();

            await wrapper.setProps({ focus: false });

            expect(input.element).not.toBe(document.activeElement);
            expect(wrapper.find('main').classes().includes('focused')).toBeFalsy();
        });
    });
});

describe('Updating input', () => {

    it('should update value from props', async () => {
        const { input, wrapper } = mountComponent();

        await wrapper.setProps({ value: 123, typingDelay: 0 });
        expect(input.element.value).toBe('123');

        const emits = emitted(wrapper, 'updated');
        expect(emits[0].value).toBe(123);
    });

    it('should not update value from props if equal to current value', async () => {
        const { input, wrapper } = mountComponent();

        await wrapper.setProps({ typingDelay: 0 });

        await input.setValue('123');
        expect(input.element.value).toBe('123');

        await wrapper.setProps({ value: 123 });
        expect(input.element.value).toBe('123');

        const created = emitted(wrapper, 'created');
        expect(created[0].value).toBe(null);

        const updated = emitted(wrapper, 'updated', 1);
        expect(updated[0].value).toBe(123);
    });
});

describe('Debouncing input', () => {

    it('should trigger debounce', async () => {
        const { input, wrapper } = mountComponent();

        await input.setValue('123');
        expect(wrapper.emitted('updated')).toBeFalsy();

        vi.advanceTimersToNextTimer();

        const emits = emitted(wrapper, 'updated');
        expect(emits[0].value).toBe(123);
    });

    it('should trigger debounce immediately without delay set', async () => {
        const { input, wrapper } = mountComponent();
        await wrapper.setProps({ typingDelay: 0 });

        await input.setValue('123');

        const emits = emitted(wrapper, 'updated');
        expect(emits[0].value).toBe(123);
    });
});

describe('Validating field', () => {

    it('should show a validation error', async () => {
        const wrapper = mount(NumberField, {
            props: Object.assign({}, props, { required: true }),
            slots: { required: 'required error' }
        });

        const input = wrapper.find('input');
        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

        await input.trigger('blur');

        expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
        expect(wrapper.find('strong.validation-error').text()).toBe('required error');
    });

    it('should not show a validation error when focused', async () => {
        const wrapper = mount(NumberField, {
            props: Object.assign({}, props, { required: true }),
            slots: { required: 'required error' }
        });

        const input = wrapper.find('input');
        await input.setValue('123');
        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

        await input.setValue('');
        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();
    });

    it('should trigger validation via props', async () => {
        const wrapper = mount(NumberField, {
            props: Object.assign({}, props, { required: true }),
            slots: { required: 'required error' }
        });

        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

        await wrapper.setProps({ triggerValidation: 'required' });
        expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
    });

    it('should not show a validation error when null', async () => {
        const wrapper = mount(NumberField, {
            props: Object.assign({}, props, { required: null }),
            slots: { required: 'required error' }
        });

        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

        await wrapper.setProps({ triggerValidation: 'required' });
        expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
    });

    describe('Specific validations', () => {

        it('should trigger min validation', async () => {
            const wrapper = mount(NumberField, {
                props: Object.assign({}, props, { min: 2 }),
                slots: { min: 'min error' }
            });

            const input = wrapper.find('input');

            await input.setValue('1');
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

            await input.trigger('blur');
            expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
            expect(wrapper.find('strong.validation-error').text()).toBe('min error');

            await input.setValue('3');
            await input.trigger('blur');
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();
        });

        it('should trigger max validation', async () => {
            const wrapper = mount(NumberField, {
                props: Object.assign({}, props, { max: 2 }),
                slots: { max: 'max error' }
            });

            const input = wrapper.find('input');

            await input.setValue('3');
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

            await input.trigger('blur');
            expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
            expect(wrapper.find('strong.validation-error').text()).toBe('max error');

            await input.setValue('1');
            await input.trigger('blur');
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();
        });
    });

    describe('Custom validations', () => {
        const validations = [
            {
                name: 'custom',
                validator: (data: FieldData, amount: number) => (<number> data.value) === amount,
                parameters: [ 123 ]
            }
        ];

        it('should trigger custom validation', async () => {
            const wrapper = mount(NumberField, {
                props: Object.assign({}, props, { validations: validations }),
                slots: Object.assign({}, { custom: 'custom error' })
            });

            const input = wrapper.find('input');

            await input.setValue('456');
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

            await input.trigger('blur');
            expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
            expect(wrapper.find('strong.validation-error').text()).toBe('custom error');

            await input.setValue('123');
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();
        });
    });
});

function mountComponent(): { wrapper: VueWrapper<any>, input: DOMWrapper<HTMLInputElement> } {
    const wrapper = mount(NumberField, {
        props: props
    });

    const input = wrapper.find('input') as DOMWrapper<HTMLInputElement>;

    return { wrapper, input };
}
