import TextualInput from '@/v2/components/form/input/textual-input.vue';
import * as ModelFunctions from '@/v2/functions/model';
import { emittedNativeEvents } from '@test/emits';
import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it, MockInstance } from 'vitest';
import { defineComponent } from 'vue';

/**
 * @vitest-environment happy-dom
 */

const defaultProps = {
    name: 'testing-textual-input'
};

beforeAll(() => {
    expect(TextualInput).toBeTruthy();
});

describe('Mounting components', () => {
    it('should mount the input component', async () => {
        const wrapper = mount(TextualInput, { props: defaultProps });
        expect(wrapper.find('input').exists()).toBeTruthy();
    });

    // TODO: Check if we can filter/modify the initial value on mount
    // It now just accepts the initial value and does not filter/modify it
});

describe('Focusing/blurring components', () => {
    describe('On focus', () => {
        it('should focus natively', async () => {
            const { wrapper, input } = mountComponent(null, { attachTo: document.body });
            expect(input.element).not.toBe(document.activeElement);

            input.element.focus();
            expect(input.element).toBe(document.activeElement);

            const emitted = emittedNativeEvents<FocusEvent>(wrapper, 'focus', 1);
            expect(emitted[0].type).toEqual('focus');
        });

        it('should focus using function', async () => {
            const wrapper = mount(
                defineComponent({
                    components: { TextualInput },
                    template: `<textual-input ref="element" name="testing-textual-input" />`
                }),
                { attachTo: document.body }
            );

            const input = wrapper.find('input');
            expect(input.exists()).toBeTruthy();
            expect(input.element).not.toBe(document.activeElement);

            const component = wrapper.findComponent({ ref: 'element' }).vm;
            component.focus();
            expect(input.element).toBe(document.activeElement);

            const emitted = emittedNativeEvents<FocusEvent>(wrapper, 'focus', 1);
            expect(emitted[0].type).toEqual('focus');
        });
    });

    describe('On blur', () => {
        it('should blur natively', async () => {
            vi.useFakeTimers();

            const { wrapper, input } = mountComponent(null, { attachTo: document.body });
            expect(input.element).not.toBe(document.activeElement);

            input.element.focus();
            expect(input.element).toBe(document.activeElement);

            let emitted = emittedNativeEvents<FocusEvent>(wrapper, 'focus', 1);
            expect(emitted[0].type).toEqual('focus');

            input.element.blur();
            expect(input.element).not.toBe(document.activeElement);

            // Timers are needed as onBlur() in the component uses debounce
            vi.runAllTimers();

            emitted = emittedNativeEvents<FocusEvent>(wrapper, 'blur', 1);
            expect(emitted[0].type).toEqual('blur');

            vi.useRealTimers();
        });

        it('should blur using function', async () => {
            const wrapper = mount(
                defineComponent({
                    components: { TextualInput },
                    template: `<textual-input ref="element" name="testing-textual-input" />`
                }),
                { attachTo: document.body }
            );

            const input = wrapper.find('input');
            expect(input.exists()).toBeTruthy();
            expect(input.element).not.toBe(document.activeElement);

            const component = wrapper.findComponent({ ref: 'element' }).vm;
            component.focus();
            expect(input.element).toBe(document.activeElement);

            let emitted = emittedNativeEvents<FocusEvent>(wrapper, 'focus', 1);
            expect(emitted[0].type).toEqual('focus');

            component.blur();
            expect(input.element).not.toBe(document.activeElement);

            emitted = emittedNativeEvents<FocusEvent>(wrapper, 'blur', 1);
            expect(emitted[0].type).toEqual('blur');
        });

        it('should keep focus when focusing quickly after blurring', async () => {
            vi.useFakeTimers();

            const { wrapper, input } = mountComponent(null, { attachTo: document.body });
            expect(input.element).not.toBe(document.activeElement);

            input.element.focus();
            expect(input.element).toBe(document.activeElement);

            // Timers are needed as onFocus() in the component uses debounce
            vi.runAllTimers();

            const emittedFocus = emittedNativeEvents<FocusEvent>(wrapper, 'focus', 1);
            expect(emittedFocus[0].type).toEqual('focus');

            // Blur the element
            input.element.blur();
            expect(input.element).not.toBe(document.activeElement);

            // Advance time to before the blur emit would happen
            vi.advanceTimersByTime(50);
            expect(input.element).not.toBe(document.activeElement);
            emittedNativeEvents<FocusEvent>(wrapper, 'blur', 0);

            // Re-focus before the blur emit
            input.element.focus();
            expect(input.element).toBe(document.activeElement);
            emittedNativeEvents<FocusEvent>(wrapper, 'blur', 0);

            // Timers are needed as onBlur() in the component uses debounce
            vi.runAllTimers();

            emittedNativeEvents<FocusEvent>(wrapper, 'blur', 0);
            emittedNativeEvents<FocusEvent>(wrapper, 'focus', 2);

            vi.useRealTimers();
        });
    });
});

describe('Updating model value', () => {
    let createFiltersSpy: MockInstance<typeof ModelFunctions.createFilters>;
    let createModifiersSpy: MockInstance<typeof ModelFunctions.createModifiers>;
    let transformSpy: MockInstance<typeof ModelFunctions.transform>;

    beforeEach(() => {
        createFiltersSpy = vi.spyOn(ModelFunctions, 'createFilters');
        createModifiersSpy = vi.spyOn(ModelFunctions, 'createModifiers');
        transformSpy = vi.spyOn(ModelFunctions, 'transform');
    });

    afterEach(() => vi.restoreAllMocks());

    it('should update the model value', async () => {
        const { wrapper, input } = mountComponent();

        await input.setValue('updated value');
        expect(wrapper.props('modelValue')).toBe('updated value');

        expect(createFiltersSpy).not.toHaveBeenCalled();
        expect(createModifiersSpy).not.toHaveBeenCalled();
        expect(transformSpy).not.toHaveBeenCalled();
    });

    describe('Using filters', () => {
        it('should filter the value using presets', async () => {
            const { wrapper, input } = mountComponent();

            // Filter out letters
            await wrapper.setProps({ filters: 'letters' });
            await input.setValue('updated 12345');
            expect(wrapper.props('modelValue')).toBe(' 12345');

            // Filter out numbers
            await wrapper.setProps({ filters: 'numbers' });
            await input.setValue('updated 12345');
            expect(wrapper.props('modelValue')).toBe('updated ');

            // Filter out numbers and then letters
            await wrapper.setProps({ filters: ['numbers', 'letters'] });
            await input.setValue('$updated-12345_');
            expect(wrapper.props('modelValue')).toBe('$-_');

            expect(createFiltersSpy).toHaveBeenCalledTimes(3);
            expect(createModifiersSpy).not.toHaveBeenCalled();
            expect(transformSpy).toHaveBeenCalledTimes(3);
        });

        it('should filter the value using regexes', async () => {
            const { wrapper, input } = mountComponent();

            // Filter letters only
            await wrapper.setProps({ filters: /[^A-Z]/g });
            await input.setValue('UPDATED with 12345');
            expect(wrapper.props('modelValue')).toBe(' with 12345');

            // Filter numbers only
            await wrapper.setProps({ filters: /[^0-9]/g });
            await input.setValue('UPDATED with 12345');
            expect(wrapper.props('modelValue')).toBe('UPDATED with ');

            // Filter out numbers and then uppercase letters
            await wrapper.setProps({ filters: [/[^0-9]/g, /[^A-Z]/g] });
            await input.setValue('UPDATED with 12345');
            expect(wrapper.props('modelValue')).toBe(' with ');

            expect(createFiltersSpy).toHaveBeenCalledTimes(3);
            expect(createModifiersSpy).not.toHaveBeenCalled();
            expect(transformSpy).toHaveBeenCalledTimes(3);
        });

        it('should filter the value using functions', async () => {
            const { wrapper, input } = mountComponent();

            // Filter spaces
            await wrapper.setProps({
                filters: (value: string) => (value.match(/[^ ]/g) || []).join('')
            });
            await input.setValue('UPDATED with 12345');
            expect(wrapper.props('modelValue')).toBe('UPDATEDwith12345');

            // Filter numbers only
            await wrapper.setProps({
                filters: (value: string) => (value.match(/[^-]/g) || []).join('')
            });
            await input.setValue('UPDATED-with-12345');
            expect(wrapper.props('modelValue')).toBe('UPDATEDwith12345');

            // Filter out numbers and then uppercase letters
            await wrapper.setProps({
                filters: [
                    (value: string) => (value.match(/[^ ]/g) || []).join(''),
                    (value: string) => (value.match(/[^-]/g) || []).join('')
                ]
            });
            await input.setValue('UPDATED-with 12345');
            expect(wrapper.props('modelValue')).toBe('UPDATEDwith12345');

            expect(createFiltersSpy).toHaveBeenCalledTimes(3);
            expect(createModifiersSpy).not.toHaveBeenCalled();
            expect(transformSpy).toHaveBeenCalledTimes(3);
        });
    });

    describe('Using modifiers', () => {
        it('should modify the value using presets', async () => {
            const { wrapper, input } = mountComponent();

            // Convert to lowercase
            await wrapper.setProps({ modifiers: 'lowercase' });
            await input.setValue('UPDATED 12345');
            expect(wrapper.props('modelValue')).toBe('updated 12345');

            // Convert to uppercase
            await wrapper.setProps({ modifiers: 'uppercase' });
            await input.setValue('updated 12345');
            expect(wrapper.props('modelValue')).toBe('UPDATED 12345');

            // Convert to lowercase and then uppercase
            await wrapper.setProps({ modifiers: ['lowercase', 'uppercase'] });
            await input.setValue('updated 12345');
            expect(wrapper.props('modelValue')).toBe('UPDATED 12345');

            expect(createFiltersSpy).toHaveBeenCalledTimes(3);
            for (let i = 1; i < 4; i++) {
                expect(createFiltersSpy).toHaveBeenNthCalledWith(i, undefined);
            }
            // Three times for the model modifiers (which are empty) and three times for the props
            expect(createModifiersSpy).toHaveBeenCalledTimes(6);
            expect(transformSpy).toHaveBeenCalledTimes(3);
        });

        it('should modify the value using functions', async () => {
            const { wrapper, input } = mountComponent();

            // Get the first 7 characters
            await wrapper.setProps({ modifiers: (value: string) => value.substring(0, 7) });
            await input.setValue('updated 12345');
            expect(wrapper.props('modelValue')).toBe('updated');

            // Get the last 5 characters
            await wrapper.setProps({ modifiers: (value: string) => value.slice(-5) });
            await input.setValue('updated 12345');
            expect(wrapper.props('modelValue')).toBe('12345');

            // Remove the first 3 and then the last 3 characters
            await wrapper.setProps({
                modifiers: [
                    (value: string) => value.substring(3),
                    (value: string) => value.substring(0, value.length - 3)
                ]
            });
            await input.setValue('updated 12345');
            expect(wrapper.props('modelValue')).toBe('ated 12');

            expect(createFiltersSpy).toHaveBeenCalledTimes(3);
            for (let i = 1; i < 4; i++) {
                expect(createFiltersSpy).toHaveBeenNthCalledWith(i, undefined);
            }
            // Three times for the model modifiers (which are empty) and three times for the props
            expect(createModifiersSpy).toHaveBeenCalledTimes(6);
            expect(transformSpy).toHaveBeenCalledTimes(3);
        });
    });

    describe('Using model modifiers', () => {
        it('should lowercase the value', async () => {
            const { wrapper, input } = mountComponent({ modelModifiers: { lowercase: true } });

            // Convert to lowercase
            await input.setValue('UPDATED 12345');
            expect(wrapper.props('modelValue')).toBe('updated 12345');

            expect(createFiltersSpy).toHaveBeenCalledOnce();
            expect(createModifiersSpy).toHaveBeenCalledOnce();
            expect(transformSpy).toHaveBeenCalledOnce();
        });

        it('should uppercase the value', async () => {
            const { wrapper, input } = mountComponent({ modelModifiers: { uppercase: true } });

            // Convert to uppercase
            await input.setValue('updated 12345');
            expect(wrapper.props('modelValue')).toBe('UPDATED 12345');

            expect(createFiltersSpy).toHaveBeenCalledOnce();
            expect(createModifiersSpy).toHaveBeenCalledOnce();
            expect(transformSpy).toHaveBeenCalledOnce();
        });

        it('should lowercase then uppercase the value', async () => {
            const { wrapper, input } = mountComponent({
                modelModifiers: { lowercase: true, uppercase: true }
            });

            // Convert to lowercase and then to uppercase
            await input.setValue('UPDATED 12345');
            expect(wrapper.props('modelValue')).toBe('UPDATED 12345');

            expect(createFiltersSpy).toHaveBeenCalledOnce();
            expect(createModifiersSpy).toHaveBeenCalledOnce();
            expect(transformSpy).toHaveBeenCalledOnce();
        });
    });
});

function mountComponent(customProps?: Record<string, any> | null, args?: Record<string, any>) {
    const wrapper = mount(TextualInput, {
        props: {
            ...defaultProps,
            modelValue: 'initial',
            'onUpdate:modelValue': (value: string) => wrapper.setProps({ modelValue: value }),
            ...(customProps ?? {})
        },
        ...args
    });

    // Get the input
    const input = wrapper.find('input');

    // Perform base tests
    expect(input.exists()).toBeTruthy();
    expect(wrapper.props('modelValue')).toBe('initial');

    return { wrapper, input };
}
