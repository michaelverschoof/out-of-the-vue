import CheckableField from '@/components/form/fields/checkable-field/checkable-field.vue';
import { FieldData, ValidatedFieldData } from '@/composables/types';
import { emitted } from '@test/emits';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * @vitest-environment jsdom
 * Used instead of happy-dom to get the `main.value.includes(document.activeElement)` working
 */

const props = {
    name: 'checkable-field'
};

const slots = {
    foo: 'Foo',
    bar: 'Bar',
    baz: 'Baz'
};

const createdEmit = {
    name: props.name,
    value: [],
    valid: true,
    failed: []
};

const validSingleUpdate = {
    name: props.name,
    value: [ 'bar' ],
    valid: true,
    failed: []
};

const validMultipleUpdate = {
    name: props.name,
    value: [ 'bar', 'baz' ],
    valid: true,
    failed: []
};

const radioProps = Object.assign({ type: 'radio' }, props);
const checkboxProps = Object.assign({ type: 'checkbox' }, props);

beforeAll(() => {
    expect(CheckableField).toBeTruthy();
});

describe('Mounting components', () => {

    it('should mount the radio component', async () => {
        const { wrapper } = mountRadio();

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual(createdEmit);
    });

    it('should mount the checkbox component', async () => {
        const { wrapper } = mountCheckbox();

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual(createdEmit);
    });

    it('should mount the checkbox component with hidden inputs', async () => {
        const props = Object.assign({}, checkboxProps, { hideInput: true });
        const { items } = mountCheckable(props);

        expect(items.every(item => item.find('input').classes().includes('hidden'))).toBeTruthy();
    });

    it('should mount the checkbox component with disabled item', async () => {
        const props = Object.assign({}, checkboxProps, { disabled: [ 'bar' ] });
        const { items } = mountCheckable(props);

        expect(items[0].classes().includes('disabled')).toBeFalsy();
        expect(items[1].classes().includes('disabled')).toBeTruthy();
        expect(items[2].classes().includes('disabled')).toBeFalsy();
    });
});

describe('Providing non-item slots', () => {

    it('should show label and info on the radio component', async () => {
        const wrapper = mount(CheckableField, {
            props: radioProps,
            slots: Object.assign({}, slots, { label: 'some radio label', information: 'some radio info' })
        });

        const label = wrapper.find('.label') as DOMWrapper<HTMLElement>;
        expect(label.exists()).toBeTruthy();
        expect(label.text()).toBe('some radio label');

        const info = wrapper.find('.information') as DOMWrapper<HTMLElement>;
        expect(info.exists()).toBeTruthy();
        expect(info.text()).toBe('some radio info');
    });

    it('should show label and info on the checkbox component', async () => {
        const wrapper = mount(CheckableField, {
            props: checkboxProps,
            slots: Object.assign({}, slots, { label: 'some checkbox label', information: 'some checkbox info' })
        });

        const label = wrapper.find('.label') as DOMWrapper<HTMLElement>;
        expect(label.exists()).toBeTruthy();
        expect(label.text()).toBe('some checkbox label');

        const info = wrapper.find('.information') as DOMWrapper<HTMLElement>;
        expect(info.exists()).toBeTruthy();
        expect(info.text()).toBe('some checkbox info');
    });
});

describe('Ticking radio items', () => {

    it('should tick the radio item', async () => {
        const { items, wrapper } = mountRadio();

        await check(items[1]);

        const emits = emitted(wrapper, 'updated') as ValidatedFieldData[];
        expect(emits[0]).toEqual(validSingleUpdate);
    });

    it('should tick the radio item on load', async () => {
        const { items, wrapper } = mountRadio([ 'bar' ]);

        expect(items[0].classes().includes('selected')).toBeFalsy();
        expect(items[1].classes().includes('selected')).toBeTruthy();
        expect(items[2].classes().includes('selected')).toBeFalsy();

        const emits = emitted(wrapper, 'created') as ValidatedFieldData[];
        expect(emits[0]).toEqual(validSingleUpdate);
    });

    it('should tick the radio item on prop update', async () => {
        const { items, wrapper } = mountRadio();
        expect(items.every(item => !item.classes().includes('selected'))).toBeTruthy();

        const emits = emitted(wrapper, 'created') as ValidatedFieldData[];
        expect(emits[0]).toEqual(createdEmit);

        await wrapper.setProps({ selected: [ 'bar' ] });
        expect(items[0].classes().includes('selected')).toBeFalsy();
        expect(items[1].classes().includes('selected')).toBeTruthy();
        expect(items[2].classes().includes('selected')).toBeFalsy();

        emitted(wrapper, 'updated', 0);
    });

    it('should not tick the radio item on prop update if already selected', async () => {
        const { items, wrapper } = mountRadio();

        await check(items[1]);
        expect(items[1].classes().includes('selected')).toBeTruthy();

        await wrapper.setProps({ selected: [ 'bar' ] });
        expect(items[1].classes().includes('selected')).toBeTruthy();

        emitted(wrapper, 'updated', 0);
    });
});

describe('Ticking checkbox boxes', () => {

    it('should tick the checkbox component', async () => {
        const { items, wrapper } = mountCheckbox();

        await check(items[1]);

        let emits = emitted(wrapper, 'updated') as ValidatedFieldData[];
        expect(emits[0]).toEqual(validSingleUpdate);

        await check(items[2]);

        emits = emitted(wrapper, 'updated', 2) as ValidatedFieldData[];
        expect(emits[1]).toEqual(validMultipleUpdate);
    });

    it('should tick the checkbox component on  load', async () => {
        const { items, wrapper } = mountCheckbox([ 'bar', 'baz' ]);

        expect(items[0].classes().includes('selected')).toBeFalsy();
        expect(items[1].classes().includes('selected')).toBeTruthy();
        expect(items[2].classes().includes('selected')).toBeTruthy();

        const emits = emitted(wrapper, 'created') as ValidatedFieldData[];
        expect(emits[0]).toEqual(validMultipleUpdate);
    });

    it('should tick the checkbox component on prop update', async () => {
        const { items, wrapper } = mountCheckbox();
        expect(items.every(item => !item.classes().includes('selected'))).toBeTruthy();

        const emits = emitted(wrapper, 'created') as ValidatedFieldData[];
        expect(emits[0]).toEqual(createdEmit);

        await wrapper.setProps({ selected: [ 'bar', 'baz' ] });

        expect(items[0].classes().includes('selected')).toBeFalsy();
        expect(items[1].classes().includes('selected')).toBeTruthy();
        expect(items[2].classes().includes('selected')).toBeTruthy();

        emitted(wrapper, 'updated', 0);
    });

    it('should not tick the checkbox item on prop update if already selected', async () => {
        const { items, wrapper } = mountCheckbox();

        await check(items[1]);
        expect(items[1].classes().includes('selected')).toBeTruthy();

        await wrapper.setProps({ selected: [ 'bar' ] });
        expect(items[1].classes().includes('selected')).toBeTruthy();

        emitted(wrapper, 'updated', 0);
    });

    it('should not tick the checkbox item on prop update if null is provided', async () => {
        const { items, wrapper } = mountCheckbox();

        await wrapper.setProps({ selected: [ null ] });
        expect(items.some(item => item.classes().includes('selected'))).toBeFalsy();

        await wrapper.setProps({ selected: null });
        expect(items.some(item => item.classes().includes('selected'))).toBeFalsy();

        emitted(wrapper, 'updated', 0);
    });
});

describe('Focusing items', () => {

    it('should focus the radio item', async () => {
        const { items } = mountRadio();

        await items[1].find('input').trigger('focus');
        expect(items[1].classes().includes('focused')).toBeTruthy();
    });

    it('should focus the checkbox item', async () => {
        const { items } = mountCheckbox();

        await items[1].find('input').trigger('focus');
        expect(items[1].classes().includes('focused')).toBeTruthy();
    });

    it('should blur the radio item', async () => {
        const { items } = mountRadio();

        await items[1].find('input').trigger('focus');
        expect(items[1].classes().includes('focused')).toBeTruthy();

        await items[1].find('input').trigger('blur');
        expect(items[1].classes().includes('focused')).toBeFalsy();
    });

    it('should blur the checkbox item', async () => {
        const { items } = mountCheckbox();

        await items[1].find('input').trigger('focus');
        expect(items[1].classes().includes('focused')).toBeTruthy();

        await items[1].find('input').trigger('blur');
        expect(items[1].classes().includes('focused')).toBeFalsy();
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
        const wrapper = mount(CheckableField, {
            props: Object.assign({}, checkboxProps, { required: true }),
            slots: Object.assign({}, slots, { required: 'required error' })
        });

        const item = wrapper.find('.checkable-field-item');
        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

        await check(item);
        await uncheck(item);

        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

        await wrapper.find('main').trigger('blur');

        expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
        expect(wrapper.find('strong.validation-error').text()).toBe('required error');
    });

    it('should not show a validation error when focus is still inside the field', async () => {
        const wrapper = mount(CheckableField, {
            props: Object.assign({}, checkboxProps, { required: true }),
            slots: Object.assign({}, slots, { required: 'required error' }),
            attachTo: document.body
        });

        const items = wrapper.findAll('.checkable-field-item');
        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

        await check(items[0]);
        await uncheck(items[0]);

        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

        const input = items[1].find('input');
        await input.element.focus();
        expect(input.element).toBe(document.activeElement);
        expect(items[1].classes().includes('focused')).toBeTruthy();

        await wrapper.find('main').trigger('blur');
        expect(input.element).toBe(document.activeElement);

        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();
    });

    it('should trigger validation via props', async () => {
        const wrapper = mount(CheckableField, {
            props: radioProps,
            slots: Object.assign({}, slots, { required: 'required error' })
        });

        expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

        await wrapper.setProps({ triggerValidation: 'required' });
        expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
    });

    describe('Specific validations', () => {

        it('should trigger min validation', async () => {
            const wrapper = mount(CheckableField, {
                props: Object.assign({}, checkboxProps, { min: 2 }),
                slots: Object.assign({}, slots, { min: 'min error' })
            });

            const items = wrapper.findAll('.checkable-field-item');
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

            await check(items[0]);
            await wrapper.find('main').trigger('blur');

            expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
            expect(wrapper.find('strong.validation-error').text()).toBe('min error');
        });

        it('should not trigger min validation', async () => {
            const wrapper = mount(CheckableField, {
                props: Object.assign({}, checkboxProps, { min: 2 }),
                slots: Object.assign({}, slots, { min: 'min error' })
            });

            const items = wrapper.findAll('.checkable-field-item');
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

            await check(items[0]);
            await check(items[2]);
            await wrapper.find('main').trigger('blur');

            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();
        });

        it('should trigger max validation', async () => {
            const wrapper = mount(CheckableField, {
                props: Object.assign({}, checkboxProps, { max: 2 }),
                slots: Object.assign({}, slots, { max: 'max error' })
            });

            const items = wrapper.findAll('.checkable-field-item');
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

            await check(items[0]);
            await check(items[1]);
            await check(items[2]);
            await wrapper.find('main').trigger('blur');

            expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
            expect(wrapper.find('strong.validation-error').text()).toBe('max error');
        });

        it('should not trigger max validation', async () => {
            const wrapper = mount(CheckableField, {
                props: Object.assign({}, checkboxProps, { max: 2 }),
                slots: Object.assign({}, slots, { max: 'max error' })
            });

            const items = wrapper.findAll('.checkable-field-item');
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

            await check(items[0]);
            await check(items[1]);
            await wrapper.find('main').trigger('blur');

            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();
        });
    });

    describe('Custom validations', () => {
        const validations = [
            {
                name: 'custom',
                validator: (data: FieldData, find: string) => (<string[]> data.value).includes(find),
                parameters: [ 'foo' ]
            }
        ];

        it('should trigger custom validation', async () => {
            const wrapper = mount(CheckableField, {
                props: Object.assign({}, checkboxProps, { validations: validations }),
                slots: Object.assign({}, slots, { custom: 'custom error' })
            });

            const items = wrapper.findAll('.checkable-field-item');
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

            await check(items[1]);
            await wrapper.find('main').trigger('blur');

            expect(wrapper.find('strong.validation-error').exists()).toBeTruthy();
            expect(wrapper.find('strong.validation-error').text()).toBe('custom error');
        });

        it('should not trigger custom validation', async () => {
            const wrapper = mount(CheckableField, {
                props: Object.assign({}, checkboxProps, { validations: validations }),
                slots: Object.assign({}, slots, { custom: 'custom error' })
            });

            const items = wrapper.findAll('.checkable-field-item');
            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();

            await check(items[0]);
            await wrapper.find('main').trigger('blur');

            expect(wrapper.find('strong.validation-error').exists()).toBeFalsy();
        });
    });
});

function check(item: DOMWrapper<Element>): Promise<void> {
    const input = item.find('input');
    const element = input.element as HTMLInputElement;
    element.checked = true;
    expect(element.checked).toBeTruthy();

    return input.trigger('change');
}

function uncheck(item: DOMWrapper<Element>): Promise<void> {
    const input = item.find('input');
    const element = input.element as HTMLInputElement;
    element.checked = false;
    expect(element.checked).toBeFalsy();

    return input.trigger('change');
}

type MountResult = { wrapper: VueWrapper<any>, items: DOMWrapper<HTMLElement>[] }

function mountCheckbox(selected?: string[]): MountResult {
    const props = !selected ? checkboxProps : Object.assign({}, checkboxProps, { selected: selected });
    return mountCheckable(props);
}

function mountRadio(selected?: string[]): MountResult {
    const props = !selected ? radioProps : Object.assign({}, radioProps, { selected: selected });
    return mountCheckable(props);
}

function mountCheckable(props: { type: string } & { name: string }): MountResult {
    const wrapper = mount(CheckableField, {
        props: props,
        slots: slots
    });

    const items = wrapper.findAll('.checkable-field-item') as DOMWrapper<HTMLElement>[];
    expect(items.length).toBe(3);

    return { wrapper, items };
}
