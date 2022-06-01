import OneTimeCodeField from '@/components/form/fields/input-field/one-time-code-field.vue';
import { FieldData, ValidatedFieldData } from '@/composables/types';
import { emitted } from '@test/emits';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * @vitest-environment jsdom
 * Used instead of happy-dom to get the `main.value.includes(document.activeElement)` working
 */

const props = {
    name: 'one-time-code-field'
};

const createdEmit = {
    name: props.name,
    value: [ null, null, null, null, null, null ],
    valid: true,
    failed: []
};

beforeAll(() => {
    expect(OneTimeCodeField).toBeTruthy();
});

describe('Mounting components', () => {

    it('should mount the component', async () => {
        const { inputs, wrapper } = mountComponent();
        expect(inputs.length).toBe(6);
        expect(inputs.every(input => input.attributes().name.startsWith(props.name))).toBeTruthy();

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual(createdEmit);
    });

    it('should mount the component with a specific amount of inputs', async () => {
        const wrapper = mount(OneTimeCodeField, {
            props: Object.assign({}, props, { length: 3 })
        });

        const inputs = wrapper.findAll('input');
        expect(inputs.length).toBe(3);
    });

    it('should mount the component with label and information', async () => {
        const wrapper = mount(OneTimeCodeField, {
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
            const { inputs, wrapper } = mountComponent();
            expect(wrapper.find('.focused').exists()).toBeFalsy();

            await inputs[0].element.focus();

            expect(inputs[0].element).toBe(document.activeElement);
            expect(inputs[0].classes().includes('focused')).toBeTruthy();
        });

        it('should focus from initial prop', async () => {
            const wrapper = mount(OneTimeCodeField, {
                props: Object.assign({}, props, { focus: true }),
                attachTo: document.body
            });

            await wrapper.vm.$nextTick();

            const input = wrapper.find('input');
            expect(input.element).toBe(document.activeElement);
            expect(input.classes().includes('focused')).toBeTruthy();
        });

        it('should focus from prop', async () => {
            const { inputs, wrapper } = mountComponent();

            expect(wrapper.find('.focused').exists()).toBeFalsy();

            await wrapper.setProps({ focus: true });

            expect(inputs[0].element).toBe(document.activeElement);
            expect(inputs[0].classes().includes('focused')).toBeTruthy();
        });

        it('should not change focus from prop if already focused', async () => {
            const { inputs, wrapper } = mountComponent();

            expect(wrapper.find('.focused').exists()).toBeFalsy();

            await inputs[0].element.focus();
            expect(inputs[0].element).toBe(document.activeElement);
            expect(inputs[0].classes().includes('focused')).toBeTruthy();

            await wrapper.setProps({ focus: true });

            expect(inputs[0].element).toBe(document.activeElement);
            expect(inputs[0].classes().includes('focused')).toBeTruthy();
        });

        it('should jump focus to next natively', async () => {
            const { inputs, wrapper } = mountComponent();

            expect(wrapper.find('.focused').exists()).toBeFalsy();

            await inputs[0].element.focus();
            expect(inputs[0].element).toBe(document.activeElement);
            expect(inputs[0].classes().includes('focused')).toBeTruthy();

            await inputs[1].trigger('focused');
            expect(inputs[1].element).toBe(document.activeElement);
            expect(inputs[1].classes().includes('focused')).toBeTruthy();
        });
    });

    describe('On blur', () => {

        it('should blur natively', async () => {
            const { inputs, wrapper } = mountComponent();

            expect(wrapper.find('.focused').exists()).toBeFalsy();

            await inputs[0].element.focus();
            expect(inputs[0].classes().includes('focused')).toBeTruthy();

            await inputs[0].element.blur();
            expect(inputs[0].element).not.toBe(document.activeElement);
            expect(inputs[0].classes().includes('focused')).toBeFalsy();
        });

        it('should blur when prop changes', async () => {
            const { inputs, wrapper } = mountComponent();

            expect(wrapper.find('.focused').exists()).toBeFalsy();

            await wrapper.setProps({ focus: true });
            expect(inputs[0].element).toBe(document.activeElement);
            expect(wrapper.find('.focused').exists()).toBeTruthy();

            await wrapper.setProps({ focus: false });
            expect(inputs[0].element).not.toBe(document.activeElement);
            expect(wrapper.find('.focused').exists()).toBeFalsy();
        });
    });
});

describe('Jump focus on input', () => {

    const updateEvent: ValidatedFieldData = {
        name: 'one-time-code-field',
        value: 'A',
        valid: true,
        failed: []
    };

    it('should jump focus to next', async () => {
        const { inputs, wrapper } = mountComponent();

        expect(wrapper.find('.focused').exists()).toBeFalsy();

        await inputs[0].element.focus();
        expect(inputs[0].classes().includes('focused')).toBeTruthy();

        await inputs[0].trigger('updated', updateEvent);
        expect(inputs[0].element.value).toBe('A');

        expect(inputs[0].classes().includes('focused')).toBeFalsy();
        expect(inputs[1].classes().includes('focused')).toBeTruthy();
    });

    it('should jump to the first empty input after the last', async () => {
        const { inputs, wrapper } = mountComponent();

        expect(wrapper.find('.focused').exists()).toBeFalsy();

        await inputs[5].element.focus();
        expect(inputs[5].classes().includes('focused')).toBeTruthy();

        await inputs[5].trigger('updated', updateEvent);
        expect(inputs[5].classes().includes('focused')).toBeFalsy();
        expect(inputs[0].classes().includes('focused')).toBeTruthy();
    });

    it('should jump out after the last when all are filled', async () => {
        const { inputs, wrapper } = mountComponent();

        expect(wrapper.find('.focused').exists()).toBeFalsy();

        await inputs[0].trigger('updated', updateEvent);
        await inputs[1].trigger('updated', updateEvent);
        await inputs[2].trigger('updated', updateEvent);
        await inputs[3].trigger('updated', updateEvent);
        await inputs[4].trigger('updated', updateEvent);
        await inputs[5].trigger('updated', updateEvent);

        expect(wrapper.find('.focused').exists()).toBeFalsy();
    });

    it('should jump focus to previous', async () => {
        const { inputs, wrapper } = mountComponent();

        expect(wrapper.find('.focused').exists()).toBeFalsy();

        await inputs[0].trigger('updated', updateEvent);
        expect(inputs[0].classes().includes('focused')).toBeFalsy();
        expect(inputs[1].classes().includes('focused')).toBeTruthy();

        await inputs[1].trigger('keydown.delete');
        expect(inputs[1].classes().includes('focused')).toBeFalsy();
        expect(inputs[0].classes().includes('focused')).toBeTruthy();
    });

    it('should empty field instead of jumping back', async () => {
        // const { inputs, wrapper } = mountComponent();
        const wrapper = mount(OneTimeCodeField, {
            props: Object.assign({}, props, { required: true }),
            slots: { required: 'required error' },
            attachTo: document.body
        });

        const inputs = wrapper.findAll('input');

        expect(wrapper.find('.focused').exists()).toBeFalsy();

        await inputs[0].trigger('updated', updateEvent);
        expect(inputs[0].classes().includes('focused')).toBeFalsy();
        expect(inputs[1].classes().includes('focused')).toBeTruthy();

        await inputs[1].trigger('updated', Object.assign({}, updateEvent, { value: 'B' }));
        expect(inputs[1].element.value).toBe('B');
        expect(inputs[1].classes().includes('focused')).toBeFalsy();
        expect(inputs[2].classes().includes('focused')).toBeTruthy();

        await inputs[2].trigger('keydown.delete');
        expect(inputs[1].classes().includes('focused')).toBeTruthy();

        await inputs[1].trigger('keydown.delete');
        expect(inputs[1].element.value).toBe('');
        expect(inputs[1].classes().includes('focused')).toBeTruthy();
        expect(inputs[1].element).toBe(document.activeElement);
    });

    it('should not jump focus if invalid data', async () => {
        const wrapper = mount(OneTimeCodeField, {
            props: Object.assign({}, props, { required: true }),
            slots: { required: 'required error' },
            attachTo: document.body
        });

        expect(wrapper.find('.focused').exists()).toBeFalsy();

        const inputs = wrapper.findAll('input');
        await inputs[0].element.focus();
        expect(inputs[0].classes().includes('focused')).toBeTruthy();

        await inputs[0].trigger('updated', { name: updateEvent.name, value: null });
        expect(inputs[0].classes().includes('focused')).toBeTruthy();
        expect(inputs[1].classes().includes('focused')).toBeFalsy();
    });
});

describe('Preventing keyboard input', () => {

    it('should allow alpha characters', async () => {
        const wrapper = mount(OneTimeCodeField, {
            props: Object.assign({}, props, { type: 'alpha' }),
            attachTo: document.body
        });

        const myEvent = new KeyboardEvent('keypress', { key: 'a' });
        vi.spyOn(myEvent, 'preventDefault');

        wrapper.find('input').element.dispatchEvent(myEvent);
        expect(myEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should prevent non-alpha characters', async () => {
        const wrapper = mount(OneTimeCodeField, {
            props: Object.assign({}, props, { type: 'alpha' }),
            attachTo: document.body
        });

        const myEvent = new KeyboardEvent('keypress', { key: '9' });
        vi.spyOn(myEvent, 'preventDefault');

        wrapper.find('input').element.dispatchEvent(myEvent);
        expect(myEvent.preventDefault).toHaveBeenCalled();
    });

    it('should allow numeric characters', async () => {
        const wrapper = mount(OneTimeCodeField, {
            props: Object.assign({}, props, { type: 'numeric' }),
            attachTo: document.body
        });

        const myEvent = new KeyboardEvent('keypress', { key: '9' });
        vi.spyOn(myEvent, 'preventDefault');

        wrapper.find('input').element.dispatchEvent(myEvent);
        expect(myEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should prevent non-numeric characters', async () => {
        const wrapper = mount(OneTimeCodeField, {
            props: Object.assign({}, props, { type: 'numeric' }),
            attachTo: document.body
        });

        const myEvent = new KeyboardEvent('keypress', { key: 'a' });
        vi.spyOn(myEvent, 'preventDefault');

        wrapper.find('input').element.dispatchEvent(myEvent);
        expect(myEvent.preventDefault).toHaveBeenCalled();
    });
});

describe('Pasting data', () => {

    it('should fill the inputs', async () => {
        const { inputs, wrapper } = mountComponent();

        const fieldset = wrapper.find('fieldset');

        await fieldset.trigger('paste', { clipboardData: { getData: () => 'foobar' } });
        expect(inputs[0].element.value).toBe('F');
        expect(inputs[1].element.value).toBe('O');
        expect(inputs[2].element.value).toBe('O');
        expect(inputs[3].element.value).toBe('B');
        expect(inputs[4].element.value).toBe('A');
        expect(inputs[5].element.value).toBe('R');
    });

    it('should fill some inputs', async () => {
        const { inputs, wrapper } = mountComponent();

        const fieldset = wrapper.find('fieldset');

        await fieldset.trigger('paste', { clipboardData: { getData: () => 'foo' } });
        expect(inputs[0].element.value).toBe('F');
        expect(inputs[1].element.value).toBe('O');
        expect(inputs[2].element.value).toBe('O');
        expect(inputs[3].element.value).toBe('');
        expect(inputs[4].element.value).toBe('');
        expect(inputs[5].element.value).toBe('');
    });

    it('should not fill if value is empty or null', async () => {
        const { inputs, wrapper } = mountComponent();

        const fieldset = wrapper.find('fieldset');

        await fieldset.trigger('paste', { clipboardData: { getData: () => '' } });
        expect(inputs[0].element.value).toBe('');
        expect(inputs[1].element.value).toBe('');

        await inputs[0].trigger('paste', { clipboardData: { getData: () => null } });
        expect(inputs[0].element.value).toBe('');
        expect(inputs[1].element.value).toBe('');
    });
});

describe('Validating field', () => {

    beforeEach(() => {
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation(
            (callback: FrameRequestCallback): number => {
                callback(100);
                return 0;
            }
        );
    });

    it('should show a validation error', async () => {
        const wrapper = mount(OneTimeCodeField, {
            props: Object.assign({}, props, { required: true }),
            slots: { required: 'required error' }
        });

        const inputs = wrapper.findAll('input');
        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

        await inputs[0].element.focus();
        expect(inputs.some(input => input.classes().includes('invalid'))).toBeFalsy();
        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

        await wrapper.find('main').trigger('blur');
        expect(inputs.every(input => input.classes().includes('invalid'))).toBeTruthy();

        expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
        expect(wrapper.find('strong.validation-error').text()).toBe('required error');
    });

    it('should not show a validation error when focused', async () => {
        const wrapper = mount(OneTimeCodeField, {
            props: Object.assign({}, props, { required: true }),
            slots: { required: 'required error' },
            attachTo: document.body
        });

        const inputs = wrapper.findAll('input');
        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

        await inputs[0].element.focus();
        expect(inputs[0].classes().includes('focused')).toBeTruthy();

        await wrapper.find('main').trigger('blur');
        expect(inputs.some(input => input.classes().includes('invalid'))).toBeFalsy();
        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();
    });

    it('should trigger validation via props', async () => {
        const wrapper = mount(OneTimeCodeField, {
            props: Object.assign({}, props, { required: true }),
            slots: { required: 'required error' },
            attachTo: document.body
        });

        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

        await wrapper.setProps({ triggerValidation: 'required' });
        expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
    });

    describe('Custom validations', () => {
        const validations = [
            {
                name: 'custom',
                validator: (data: FieldData) => JSON.stringify(data.value) === JSON.stringify([ 'F', 'O', 'O', 'B', 'A', 'R' ]),
                parameters: null
            }
        ];

        it('should trigger custom validation', async () => {
            const wrapper = mount(OneTimeCodeField, {
                props: Object.assign({}, props, { validations: validations }),
                slots: { custom: 'custom error' }
            });

            await wrapper.find('fieldset').trigger('paste', { clipboardData: { getData: () => 'foobaz' } });
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

            await wrapper.find('main').trigger('blur');
            expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
            expect(wrapper.find('strong.validation-error').text()).toBe('custom error');
        });

        it('should not trigger custom validation', async () => {
            const wrapper = mount(OneTimeCodeField, {
                props: Object.assign({}, props, { validations: validations }),
                slots: { custom: 'custom error' }
            });

            await wrapper.find('fieldset').trigger('paste', { clipboardData: { getData: () => 'foobar' } });
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

            await wrapper.find('main').trigger('blur');
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();
        });
    });
});

function mountComponent(): { wrapper: VueWrapper<any>, inputs: DOMWrapper<HTMLInputElement>[] } {
    const wrapper = mount(OneTimeCodeField, {
        props: props,
        attachTo: document.body
    });

    const inputs = wrapper.findAll('input') as DOMWrapper<HTMLInputElement>[];

    return { wrapper, inputs };
}
