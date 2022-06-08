import ValidatableInput from '@/components/form/fields/base/validatable-input.vue';
import { SubmittedSymbol, ValidationMethod } from '@/composables/types';
import { predefinedValidations } from '@/composables/validate-user-input';
import { emitted } from '@test/emits';
import { MountedComponent } from '@test/types';
import { mount, MountingOptions } from '@vue/test-utils';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { ref } from 'vue';

/**
 * @vitest-environment happy-dom
 */

const data = { name: 'test', value: 'foo' };

const validations = [
    { ...predefinedValidations['required'], parameters: [ true ] },
    { ...predefinedValidations['min-length'], parameters: [ 2 ] },
    { ...predefinedValidations['max-length'], parameters: [ 5 ] }
];

let provided = ref(false);

beforeAll(() => {
    expect(ValidatableInput).toBeTruthy();
});

describe('Mounting component', () => {

    it('should mount the component', async () => {
        const { wrapper } = mountComponent();
        expect(wrapper.html()).toBe('<div class="">Foo</div>\n<!--v-if-->');
    });

    it('should mount the component validations', async () => {
        const { wrapper } = mountComponent(null, validations);
        expect(wrapper.html()).toBe('<div class="invalid">Foo</div>\n<!--v-if-->');
    });
});

describe('Validating on create event', () => {

    it('should validate', async () => {
        const { element, wrapper } = mountComponent(null, validations);
        expect(wrapper.emitted('created')).toBeFalsy();

        await element.trigger('created');

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual({
            ...data,
            valid: true,
            failed: []
        });
    });

    it('should validate without validations', async () => {
        const { element, wrapper } = mountComponent();
        expect(wrapper.emitted('created')).toBeFalsy();

        await element.trigger('created');

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual({
            ...data,
            valid: true,
            failed: []
        });
    });

    it('should fail on empty value', async () => {
        const { element, wrapper } = mountComponent('', validations);
        expect(wrapper.emitted('created')).toBeFalsy();

        await element.trigger('created');

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual({
            name: data.name,
            value: '',
            valid: false,
            failed: [ 'required', 'min' ]
        });
    });

    it('should fail on too short value', async () => {
        const { element, wrapper } = mountComponent('a', validations);
        expect(wrapper.emitted('created')).toBeFalsy();

        await element.trigger('created');

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual({
            name: data.name,
            value: 'a',
            valid: false,
            failed: [ 'min' ]
        });
    });

    it('should fail on too long value', async () => {
        const { element, wrapper } = mountComponent('foobar', validations);
        expect(wrapper.emitted('created')).toBeFalsy();

        await element.trigger('created');

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual({
            name: data.name,
            value: 'foobar',
            valid: false,
            failed: [ 'max' ]
        });
    });
});

describe('Validating on update event', () => {

    it('should validate', async () => {
        const { element, wrapper } = mountComponent(null, validations);
        expect(wrapper.emitted('updated')).toBeFalsy();

        await element.trigger('updated');

        const emits = emitted(wrapper, 'updated');
        expect(emits[0]).toEqual({
            ...data,
            valid: true,
            failed: []
        });
    });

    it('should validate without validations', async () => {
        const { element, wrapper } = mountComponent();
        expect(wrapper.emitted('updated')).toBeFalsy();

        await element.trigger('updated');

        const emits = emitted(wrapper, 'updated');
        expect(emits[0]).toEqual({
            ...data,
            valid: true,
            failed: []
        });
    });

    it('should fail on too short value', async () => {
        const { element, wrapper } = mountComponent('a', validations);
        expect(wrapper.emitted('updated')).toBeFalsy();

        await element.trigger('updated');

        const emits = emitted(wrapper, 'updated');
        expect(emits[0]).toEqual({
            name: data.name,
            value: 'a',
            valid: false,
            failed: [ 'min' ]
        });
    });

    it('should fail on too long value', async () => {
        const { element, wrapper } = mountComponent('foobar', validations);
        expect(wrapper.emitted('updated')).toBeFalsy();

        await element.trigger('updated');

        const emits = emitted(wrapper, 'updated');
        expect(emits[0]).toEqual({
            name: data.name,
            value: 'foobar',
            valid: false,
            failed: [ 'max' ]
        });
    });
});

describe('Show validity', () => {

    it('should trigger showing', async () => {
        const { wrapper, element } = mountComponent(null, validations);
        await element.trigger('updated');
        await element.trigger('show');

        expect(element.classes()).not.toContain('showing');
        expect(element.classes()).not.toContain('invalid');
        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();
    });

    it('should show required error', async () => {
        const { element, wrapper } = mountComponent('', validations);
        await element.trigger('updated');
        await element.trigger('show');

        expect(element.classes()).toContain('showing');
        expect(element.classes()).toContain('invalid');
        expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
        expect(wrapper.find('strong.validation-error').text()).toBe('required error');
    });

    it('should show max error', async () => {
        const { element, wrapper } = mountComponent('foobar', validations);
        await element.trigger('updated');
        await element.trigger('show');

        expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
        expect(wrapper.find('strong.validation-error').text()).toBe('max error');
    });

    it('should show min error', async () => {
        const { element, wrapper } = mountComponent('a', validations);
        await element.trigger('updated');
        await element.trigger('show');

        expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
        expect(wrapper.find('strong.validation-error').text()).toBe('min error');
    });
});

describe('Triggering validation externally', () => {

    describe('Triggering validation by prop', () => {

        it('should show error', async () => {
            const { wrapper } = mountComponent(null, validations);

            await wrapper.setProps({ triggerValidation: 'required' });

            expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
            expect(wrapper.find('strong.validation-error').text()).toBe('required error');

            expect(wrapper.emitted('updated')).toBeFalsy();
        });

        it('should hide error', async () => {
            const { wrapper } = mountComponent(null, validations);

            await wrapper.setProps({ triggerValidation: 'required' });

            expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
            expect(wrapper.find('strong.validation-error').text()).toBe('required error');

            await wrapper.setProps({ triggerValidation: null });

            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();
        });

        it('should return if no existing validation is provided', async () => {
            const { wrapper } = mountComponent(null, validations);

            await wrapper.setProps({ triggerValidation: 'foo' });

            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();
        });
    });

    describe('Triggering validation by provide', () => {

        afterEach(() => {
            provided.value = false;
        });

        it('should show error', async () => {
            const { wrapper } = mountComponent(null, validations, true);
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

            provided.value = true;
            await wrapper.vm.$nextTick();

            expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
            expect(wrapper.find('strong.validation-error').text()).toBe('required error');
        });

        it('should hide error', async () => {
            const { wrapper } = mountComponent(null, validations, true);
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

            provided.value = true;
            await wrapper.vm.$nextTick();

            expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();

            provided.value = false;
            await wrapper.vm.$nextTick();

            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();
        });

        it('should keep showing error if trigger was set', async () => {
            const { element, wrapper } = mountComponent('foo', validations, true);
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

            await element.trigger('updated');
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

            await wrapper.setProps({ triggerValidation: 'max' });
            expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
            expect(wrapper.find('strong.validation-error').text()).toBe('max error');

            provided.value = true;
            await wrapper.vm.$nextTick();

            expect(wrapper.findAll('strong.validation-error').length).toBe(1);
            expect(wrapper.find('strong.validation-error').text()).toBe('max error');
        });

        it('should return if no value is provided', async () => {
            const { wrapper } = mountComponent(null, validations);

            provided.value = true;
            await wrapper.vm.$nextTick();

            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();
        });
    });
});

function mountComponent(value?: string, validations?: ValidationMethod[], enableProvide?: boolean): MountedComponent {
    const testData = !!value || value === '' ? Object.assign({}, data, { value: value }) : data;
    const stringedData = JSON.stringify(testData).replace(/"/g, '\'');

    const options: MountingOptions<any> = {
        slots: {
            default: `<template #default="{ initialize, validate, invalid, showing, showValidity }">
                        <div :class="{ invalid, showing }"
                             @created="initialize(${ stringedData })"
                             @updated="validate(${ stringedData })"
                             @show="showValidity"
                        >Foo</div>
                      </template>`,
            required: 'required error',
            min: 'min error',
            max: 'max error'
        },
        props: {
            validations: validations
        }
    };

    if (enableProvide) {
        options.global = {
            provide: {
                [SubmittedSymbol]: provided
            }
        };
    }

    const wrapper = mount(ValidatableInput, options);

    const element = wrapper.find('div');

    return { wrapper, element };
}
