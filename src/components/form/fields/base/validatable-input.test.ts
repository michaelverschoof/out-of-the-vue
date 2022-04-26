import ValidatableInput from '@/components/form/fields/base/validatable-input.vue';
import { ValidationMethod } from '@/composables/types';
import { predefinedValidations } from '@/composables/validate-user-input';
import { emitted } from '@test/emits';
import { MountedComponent } from '@test/types';
import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * @vitest-environment happy-dom
 */

const data = { name: 'test', value: 'foo' };

const validations = [
    { ...predefinedValidations['required'], parameters: [ true ] },
    { ...predefinedValidations['min-length'], parameters: [ 2 ] },
    { ...predefinedValidations['max-length'], parameters: [ 5 ] }
];

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

function mountComponent(value?: string, validations?: ValidationMethod[]): MountedComponent {
    const testData = !!value || value === '' ? Object.assign({}, data, { value: value }) : data;
    const stringedData = JSON.stringify(testData).replace(/"/g, '\'');

    const wrapper = mount(ValidatableInput, {
        slots: {
            default: `<template #default="{ initialize, validate, invalid, showing, showValidity }">
                        <div :class="{ invalid, showing }"
                             @created="initialize(${ stringedData })"
                             @updated="validate(${ stringedData })"
                             @show="showValidity"
                        >Foo</div>
                      </template>`,
            required: 'required error',
            'min': 'min error',
            'max': 'max error'
        },
        props: {
            validations: validations
        }
    });

    const element = wrapper.find('div');

    return { wrapper, element };
}
