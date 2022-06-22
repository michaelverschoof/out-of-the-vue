import CheckableInput from '@/components/form/fields/base/checkable-input.vue';
import { CheckableFieldData } from '@/composables/types';
import { emitted } from '@test/emits';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * @vitest-environment happy-dom
 */

const props = {
    name: 'checkable-input',
    value: 'foo',
    checked: false
};

const radioProps = Object.assign({ type: 'radio' }, props);
const checkboxProps = Object.assign({ type: 'checkbox' }, props);

beforeAll(() => {
    expect(CheckableInput).toBeTruthy();
});

describe('Mounting components', () => {

    it('should mount the radio component', async () => {
        const { wrapper } = mountRadio();

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual(props);
    });

    it('should mount the checkbox component', async () => {
        const { wrapper } = mountCheckbox();

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual(props);
    });
});

describe('Ticking boxes', () => {

    it('should tick the radio component', async () => {
        const { input, wrapper } = mountRadio();

        await check(input);

        const emits = emitted(wrapper, 'updated') as CheckableFieldData[];
        expect(emits[0].checked).toBeTruthy();
    });

    it('should tick the radio component on load', async () => {
        const { input, wrapper } = mountRadio(true);

        expect(input.element.checked).toBeTruthy();

        const emits = emitted(wrapper, 'created') as CheckableFieldData[];
        expect(emits[0].checked).toBeTruthy();
    });

    it('should tick the radio component on prop update', async () => {
        const { input, wrapper } = mountRadio();

        await wrapper.setProps({ checked: true });

        expect(input.element.checked).toBeTruthy();

        emitted(wrapper, 'updated', 0);
    });

    it('should deselect the radio component', async () => {
        const { input, wrapper } = mountRadio();

        await check(input);
        await uncheck(input);

        const emits = emitted(wrapper, 'updated', 2) as CheckableFieldData[];
        expect(emits[0].checked).toBeTruthy();
        expect(emits[1].checked).toBeFalsy();
    });

    it('should reselect the radio component', async () => {
        const { input, wrapper } = mountRadio();

        await check(input);
        await check(input, false);

        const emits = emitted(wrapper, 'updated', 2) as CheckableFieldData[];
        expect(emits[0].checked).toBeTruthy();
        expect(emits[1].checked).toBeTruthy();
    });

    it('should tick the checkbox component', async () => {
        const { input, wrapper } = mountCheckbox();

        await check(input);
        expect(input.element.checked).toBeTruthy();

        const emits = emitted(wrapper, 'updated');
        expect(emits[0]).toEqual(Object.assign(props, { checked: true }));
    });

    it('should tick the checkbox component on load', async () => {
        const { input, wrapper } = mountCheckbox(true);

        expect(input.element.checked).toBeTruthy();

        const emits = emitted(wrapper, 'created') as CheckableFieldData[];
        expect(emits[0].checked).toBeTruthy();
    });

    it('should not tick the checkbox component on load with undefined', async () => {
        const { input, wrapper } = mountCheckbox(undefined);

        expect(input.element.checked).toBeFalsy();

        emitted(wrapper, 'created', 0);
    });

    it('should tick the checkbox component on prop update', async () => {
        const { input, wrapper } = mountCheckbox();

        await wrapper.setProps({ checked: true });
        expect(input.element.checked).toBeTruthy();

        emitted(wrapper, 'updated', 0);
    });

    it('should deselect the checkbox component', async () => {
        const { input, wrapper } = mountCheckbox();

        await check(input);
        expect(input.element.checked).toBeTruthy();

        await uncheck(input);
        expect(input.element.checked).toBeFalsy();

        const emits = emitted(wrapper, 'updated', 2) as CheckableFieldData[];
        expect(emits[0].checked).toBeTruthy();
        expect(emits[1].checked).toBeFalsy();
    });

    it('should not reselect the checkbox component', async () => {
        const { input, wrapper } = mountCheckbox();

        await check(input);
        expect(input.element.checked).toBeTruthy();

        await check(input, false);
        expect(input.element.checked).toBeTruthy();

        const emits = emitted(wrapper, 'updated') as CheckableFieldData[];
        expect(emits[0].checked).toBeTruthy();
    });
});

describe('Focusing boxes', () => {

    it('should focus the radio component', async () => {
        const { input, wrapper } = mountRadio();

        await input.trigger('focus');
        expect(input.classes().includes('focused')).toBeTruthy();

        emitted(wrapper, 'focused');
    });

    it('should focus the checkbox component', async () => {
        const { input, wrapper } = mountCheckbox();

        await input.trigger('focus');
        expect(input.classes().includes('focused')).toBeTruthy();

        emitted(wrapper, 'focused');
    });

    it('should blur the radio component', async () => {
        const { input, wrapper } = mountRadio();

        await input.trigger('focus');
        expect(input.classes().includes('focused')).toBeTruthy();

        await input.trigger('blur');
        expect(input.classes().includes('focused')).toBeFalsy();

        emitted(wrapper, 'focused');
        emitted(wrapper, 'blurred');
    });

    it('should blur the checkbox component', async () => {
        const { input, wrapper } = mountCheckbox();

        await input.trigger('focus');
        expect(input.classes().includes('focused')).toBeTruthy();

        await input.trigger('blur');
        expect(input.classes().includes('focused')).toBeFalsy();

        emitted(wrapper, 'focused');
        emitted(wrapper, 'blurred');
    });
});

function check(input: DOMWrapper<Element>, triggerChange: boolean = true): Promise<void> {
    (<HTMLInputElement> input.element).checked = true;
    expect((<HTMLInputElement> input.element).checked).toBeTruthy();
    return input.trigger(triggerChange ? 'change' : 'click');
}

function uncheck(input: DOMWrapper<Element>): Promise<void> {
    (<HTMLInputElement> input.element).checked = false;
    expect((<HTMLInputElement> input.element).checked).toBeFalsy();
    return input.trigger('change');
}

function mountCheckbox(checked?: boolean): { wrapper: VueWrapper<any>, input: DOMWrapper<HTMLInputElement> } {
    const props = checked === false ? checkboxProps : Object.assign({}, checkboxProps, { checked: checked });

    const wrapper = mount(CheckableInput, {
        props: props
    });

    const input = wrapper.find('input');
    expect(input.element.type).toBe('checkbox');

    return { wrapper, input };
}

function mountRadio(checked?: boolean): { wrapper: VueWrapper<any>, input: DOMWrapper<HTMLInputElement> } {
    const props = !checked ? radioProps : Object.assign({}, radioProps, { checked: true });

    const wrapper = mount(CheckableInput, {
        props: props
    });

    const input = wrapper.find('input');
    expect(input.element.type).toBe('radio');

    return { wrapper, input };
}
