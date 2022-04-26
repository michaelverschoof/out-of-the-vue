import CheckableInput from '@/components/form/fields/base/checkable-input.vue';
import { CheckableFieldData } from '@/composables/types';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';
import { emitted } from '../../../../../test/emits';

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
        expect(input.element.checked).toBeTruthy();

        const emits = emitted(wrapper, 'updated') as CheckableFieldData[];
        expect(emits[0].checked).toBeTruthy();
    });

    it('should deselect the radio component', async () => {
        const { input, wrapper } = mountRadio();

        await check(input);
        expect(input.element.checked).toBeTruthy();

        await uncheck(input);
        expect(input.element.checked).toBeFalsy();

        const emits = emitted(wrapper, 'updated', 2) as CheckableFieldData[];
        expect(emits[0].checked).toBeTruthy();
        expect(emits[1].checked).toBeFalsy();
    });

    it('should reselect the radio component', async () => {
        const { input, wrapper } = mountRadio();

        await check(input);
        expect(input.element.checked).toBeTruthy();

        await check(input, false);
        expect(input.element.checked).toBeTruthy();

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

function check(input: DOMWrapper<Element>, triggerChange: boolean = true): Promise<void> {
    (<HTMLInputElement> input.element).checked = true;
    return input.trigger(triggerChange ? 'change' : 'click');
}

function uncheck(input: DOMWrapper<Element>): Promise<void> {
    (<HTMLInputElement> input.element).checked = false;
    return input.trigger('change');
}

function mountCheckbox(): { wrapper: VueWrapper<any>, input: DOMWrapper<HTMLInputElement> } {
    const wrapper = mount(CheckableInput, {
        props: checkboxProps
    });

    const input = wrapper.find('input');
    expect(input.element.type).toBe('checkbox');

    return { wrapper, input };
}

function mountRadio(): { wrapper: VueWrapper<any>, input: DOMWrapper<HTMLInputElement> } {
    const wrapper = mount(CheckableInput, {
        props: radioProps
    });

    const input = wrapper.find('input');
    expect(input.element.type).toBe('radio');

    return { wrapper, input };
}
