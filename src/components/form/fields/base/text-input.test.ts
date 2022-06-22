import TextInput from '@/components/form/fields/base/text-input.vue';
import { emitted } from '@test/emits';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { beforeAll, describe, expect, it, vi } from 'vitest';

/**
 * @vitest-environment happy-dom
 */

const props = {
    name: 'text-input',
    value: 'foo',
    focus: false
};

const textProps = Object.assign({ textarea: false }, props);
const textareaProps = Object.assign({ textarea: true }, props);

beforeAll(() => {
    expect(TextInput).toBeTruthy();
});

describe('Mounting components', () => {

    it('should mount the text component', async () => {
        const { wrapper } = mountComponent();

        expect(wrapper.find('input').exists()).toBeTruthy();
        expect(wrapper.find('textarea').exists()).toBeFalsy();

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual({
            name: props.name,
            value: props.value
        });
    });

    it('should mount the textarea component', async () => {
        const { wrapper } = mountComponent(textareaProps);

        expect(wrapper.find('textarea').exists()).toBeTruthy();
        expect(wrapper.find('input').exists()).toBeFalsy();

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual({
            name: props.name,
            value: props.value
        });
    });
});

describe('Focusing components', () => {

    describe('On focus', () => {

        it('should focus natively', async () => {
            const { input, wrapper } = mountComponent(null, true);

            await input.element.focus();
            expect(input.element).toBe(document.activeElement);

            emitted(wrapper, 'focused');
        });

        it('should focus from initial prop', async () => {
            const { input, wrapper } = mountComponent({ focus: true }, true);

            expect(input.element).toBe(document.activeElement);

            emitted(wrapper, 'focused');
        });

        it('should focus when prop changes', async () => {
            const { input, wrapper } = mountComponent(null, true);
            expect(input.element).not.toBe(document.activeElement);

            await wrapper.setProps({ focus: true });
            expect(input.element).toBe(document.activeElement);

            emitted(wrapper, 'focused');
        });

        it('should not focus when prop changes if already focused', async () => {
            const { input, wrapper } = mountComponent(null, true);
            expect(input.element).not.toBe(document.activeElement);

            await input.element.focus();
            expect(input.element).toBe(document.activeElement);

            await wrapper.setProps({ focus: true });
            expect(input.element).toBe(document.activeElement);

            emitted(wrapper, 'focused');
        });
    });

    describe('On blur', () => {

        it('should blur natively', async () => {
            const { input, wrapper } = mountComponent({ focus: true }, true);
            expect(input.element).toBe(document.activeElement);

            await input.element.blur();

            expect(input.element).not.toBe(document.activeElement);
            emitted(wrapper, 'blurred');
        });

        it('should blur when prop changes', async () => {
            const { input, wrapper } = mountComponent({ focus: true }, true);
            expect(input.element).toBe(document.activeElement);

            await wrapper.setProps({ focus: false });
            expect(input.element).not.toBe(document.activeElement);

            emitted(wrapper, 'blurred');
        });
    });
});

describe('Filtering input', () => {

    it('should filter out characters', async () => {
        const { input, wrapper } = mountComponent({ allowedCharacters: '[A-z]' });

        await input.setValue('foo123bar');
        expect(input.element.value).toBe('foobar');

        const emits = emitted(wrapper, 'updated');
        expect(emits[0].value).toBe('foobar');
    });

    it('should not filter out characters if all matches', async () => {
        const { input, wrapper } = mountComponent({ allowedCharacters: '[A-z]' });

        await input.setValue('foo');
        expect(input.element.value).toBe('foo');

        const emits = emitted(wrapper, 'updated');
        expect(emits[0].value).toBe('foo');
    });

    it('should filter out all characters if nothing matches', async () => {
        const { input, wrapper } = mountComponent({ allowedCharacters: '[A-z]' });

        await input.setValue('12345');
        expect(input.element.value).toBe('');

        const emits = emitted(wrapper, 'updated');
        expect(emits[0].value).toBe('');
    });

    describe('When pasting values', () => {

        it('should filter characters', async () => {
            const { input, wrapper } = mountComponent({ allowedCharacters: '[A-z]' });

            await input.trigger('paste', { clipboardData: { getData: () => 'foo123bar' } });
            expect(input.element.value).toBe('foobar');

            const emits = emitted(wrapper, 'updated');
            expect(emits[0].value).toBe('foobar');
        });
    });
});

describe('Transforming input', () => {

    describe('When value changes', () => {

        it('should uppercase characters', async () => {
            const { input, wrapper } = mountComponent({ transformInput: 'uppercase' });

            await input.setValue('fooBAR');
            expect(input.element.value).toBe('FOOBAR');

            const emits = emitted(wrapper, 'updated');
            expect(emits[0].value).toBe('FOOBAR');
        });

        it('should lowercase characters', async () => {
            const { input, wrapper } = mountComponent({ transformInput: 'lowercase' });

            await input.setValue('fooBAR');
            expect(input.element.value).toBe('foobar');

            const emits = emitted(wrapper, 'updated');
            expect(emits[0].value).toBe('foobar');
        });

        it('should not transform characters when no transform is provided', async () => {
            const { input, wrapper } = mountComponent({ transformInput: null });

            await input.setValue('fooBAR');
            expect(input.element.value).toBe('fooBAR');

            const emits = emitted(wrapper, 'updated');
            expect(emits[0].value).toBe('fooBAR');
        });
    });

    describe('When pasting values', () => {

        it('should uppercase characters', async () => {
            const { input, wrapper } = mountComponent({ transformInput: 'uppercase' });

            await input.trigger('paste', { clipboardData: { getData: () => 'fooBAR' } });
            expect(input.element.value).toBe('FOOBAR');

            const emits = emitted(wrapper, 'updated');
            expect(emits[0].value).toBe('FOOBAR');
        });
    });
});

describe('Updating input', () => {

    it('should update value from props', async () => {
        const { input, wrapper } = mountComponent();

        await wrapper.setProps({ value: 'something' });
        expect(input.element.value).toBe('something');

        const emits = emitted(wrapper, 'updated');
        expect(emits[0].value).toBe('something');
    });

    it('should not update value from props if equal to current value', async () => {
        const { input, wrapper } = mountComponent({ value: 'foo' });

        await input.setValue('something');
        expect(input.element.value).toBe('something');

        await wrapper.setProps({ value: 'something' });
        expect(input.element.value).toBe('something');

        const created = emitted(wrapper, 'created');
        expect(created[0].value).toBe('foo');

        const updated = emitted(wrapper, 'updated', 1);
        expect(updated[0].value).toBe('something');
    });
});

describe('Preventing keyboard input', () => {

    it('should allow characters in the regex', async () => {
        const { wrapper } = mountComponent({ allowedCharacters: '[A-z]' }, true);

        const keyPress = new KeyboardEvent('keydown', { key: 'a' });
        vi.spyOn(keyPress, 'preventDefault');

        wrapper.find('input').element.dispatchEvent(keyPress);
        expect(keyPress.preventDefault).not.toHaveBeenCalled();
    });

    it('should prevent characters not in the regex', async () => {
        const { wrapper } = mountComponent({ allowedCharacters: '[A-z]' }, true);

        const keyPress = new KeyboardEvent('keydown', { key: '9' });
        vi.spyOn(keyPress, 'preventDefault');

        wrapper.find('input').element.dispatchEvent(keyPress);
        expect(keyPress.preventDefault).toHaveBeenCalled();
    });
});

function mountComponent(props: { [key: string]: string | boolean | null } | null = null, attachToDocument: boolean = false): { wrapper: VueWrapper<any>, input: DOMWrapper<HTMLInputElement> } {
    const options: { props: object, attachTo?: HTMLElement } = {
        props: Object.assign({}, textProps, props || null)
    };

    if (attachToDocument) {
        options.attachTo = document.body;
    }

    const wrapper = mount(TextInput, options);
    const input = wrapper.find('input');

    return { wrapper, input };
}
