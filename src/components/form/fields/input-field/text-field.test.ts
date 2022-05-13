import TextField from '@/components/form/fields/input-field/text-field.vue';
import { emitted } from '@test/emits';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

/**
 * @vitest-environment happy-dom
 */

const props = {
    name: 'text-field'
};

const createdEmit = {
    name: props.name,
    value: null,
    valid: true,
    failed: []
};

vi.useFakeTimers();

beforeAll(() => {
    expect(TextField).toBeTruthy();
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
        const wrapper = mount(TextField, {
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
        const wrapper = mount(TextField, {
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
            const wrapper = mount(TextField, {
                props: props,
                attachTo: document.body
            });

            const input = wrapper.find('input');
            await input.element.focus();

            expect(input.element).toBe(document.activeElement);
            expect(wrapper.find('main').classes().includes('focused')).toBeTruthy();
        });

        it('should focus from prop', async () => {
            const wrapper = mount(TextField, {
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
            const wrapper = mount(TextField, {
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
            const wrapper = mount(TextField, {
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

        await wrapper.setProps({ value: 'something', typingDelay: 0 });
        expect(input.element.value).toBe('something');

        const emits = emitted(wrapper, 'updated');
        expect(emits[0].value).toBe('something');
    });

    it('should not update value from props if equal to current value', async () => {
        const { input, wrapper } = mountComponent();

        await wrapper.setProps({ typingDelay: 0 });

        await input.setValue('something');
        expect(input.element.value).toBe('something');

        await wrapper.setProps({ value: 'something' });
        expect(input.element.value).toBe('something');

        const created = emitted(wrapper, 'created');
        expect(created[0].value).toBe(null);

        const updated = emitted(wrapper, 'updated', 1);
        expect(updated[0].value).toBe('something');
    });
});

describe('Debouncing input', () => {

    it('should trigger debounce', async () => {
        const { input, wrapper } = mountComponent();

        await input.setValue('foo123bar');
        expect(wrapper.emitted('updated')).toBeFalsy();

        vi.advanceTimersToNextTimer();

        const emits = emitted(wrapper, 'updated');
        expect(emits[0].value).toEqual('foo123bar');
    });

    it('should trigger debounce immediately without delay set', async () => {
        const { input, wrapper } = mountComponent();
        await wrapper.setProps({ typingDelay: 0 });

        await input.setValue('foo123bar');

        const emits = emitted(wrapper, 'updated');
        expect(emits[0].value).toEqual('foo123bar');
    });
});

function mountComponent(): { wrapper: VueWrapper<any>, input: DOMWrapper<HTMLInputElement> } {
    const wrapper = mount(TextField, {
        props: props
    });

    const input = wrapper.find('input') as DOMWrapper<HTMLInputElement>;

    return { wrapper, input };
}
