import CheckableInput from '@/components/form/fields/base/checkable-input.vue';
import { DOMWrapper, mount } from '@vue/test-utils';
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
        const radio = mount(CheckableInput, {
            props: radioProps
        });

        await radio.vm.$nextTick();

        const emitted = radio.emitted('created');
        expect(emitted).toBeTruthy();
        expect(emitted[0][0]).toEqual(props);
    });

    it('should mount the checkbox component', async () => {
        const checkbox = mount(CheckableInput, {
            props: checkboxProps
        });

        await checkbox.vm.$nextTick();

        const emitted = checkbox.emitted('created');
        expect(emitted).toBeTruthy();
        expect(emitted[0][0]).toEqual(props);
    });
});

describe('Ticking boxes', () => {

    it('should tick the radio component', async () => {
        const radio = mount(CheckableInput, {
            props: radioProps
        });

        const input = radio.find('input[type="radio"]');
        await check(input);

        expect((<HTMLInputElement> input.element).checked).toBeTruthy();
        expect(radio.emitted('updated')[0][0]).toEqual(Object.assign(props, { checked: true }));
    });

    it('should deselect the radio component', async () => {
        const radio = mount(CheckableInput, {
            props: radioProps
        });

        const input = radio.find('input[type="radio"]');
        await check(input);
        await uncheck(input);

        expect((<HTMLInputElement> input.element).checked).toBeFalsy();
        expect(radio.emitted('updated').length).toBe(2);
        expect(radio.emitted('updated')[0][0].checked).toBeTruthy();
        expect(radio.emitted('updated')[1][0].checked).toBeFalsy();
    });

    it('should reselect the radio component', async () => {
        const radio = mount(CheckableInput, {
            props: radioProps
        });

        const input = radio.find('input[type="radio"]');
        await check(input);
        await check(input, false);

        expect((<HTMLInputElement> input.element).checked).toBeTruthy();
        expect(radio.emitted('updated').length).toBe(2);
        expect(radio.emitted('updated')[0][0].checked).toBeTruthy();
        expect(radio.emitted('updated')[1][0].checked).toBeTruthy();
    });

    it('should tick the checkbox component', async () => {
        const checkbox = mount(CheckableInput, {
            props: checkboxProps
        });

        const input = checkbox.find('input[type="checkbox"]');
        await check(input);

        expect((<HTMLInputElement> input.element).checked).toBeTruthy();
        expect(checkbox.emitted('updated')[0][0]).toEqual(Object.assign(props, { checked: true }));
    });

    it('should deselect the checkbox component', async () => {
        const checkbox = mount(CheckableInput, {
            props: checkboxProps
        });

        const input = checkbox.find('input[type="checkbox"]');
        await check(input);
        await uncheck(input);

        expect((<HTMLInputElement> input.element).checked).toBeFalsy();
        expect(checkbox.emitted('updated').length).toBe(2);
        expect(checkbox.emitted('updated')[0][0].checked).toBeTruthy();
        expect(checkbox.emitted('updated')[1][0].checked).toBeFalsy();
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
