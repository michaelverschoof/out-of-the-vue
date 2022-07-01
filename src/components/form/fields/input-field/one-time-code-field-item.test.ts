import OneTimeCodeFieldItem from '@/components/form/fields/input-field/one-time-code-field-item.vue';
import { ValidatedFieldData } from '@/composables/types';
import { emitted } from '@test/emits';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * @vitest-environment jsdom
 * Used instead of happy-dom to get the `document.activeElement` working
 */

const props = {
    name: 'one-time-code-field',
    index: 1
};

const createdEmit: ValidatedFieldData = {
    name: `${ props.name }-${ props.index }`,
    value: null,
    valid: true,
    failed: []
};

beforeAll(() => {
    expect(OneTimeCodeFieldItem).toBeTruthy();
});

describe('Emitting states', () => {

    it('should mount the component', async () => {
        const { input, wrapper } = mountComponent();
        expect(input.exists()).toBeTruthy();
        expect(input.attributes().name.startsWith(props.name)).toBeTruthy();

        const emits = emitted(wrapper, 'created');
        expect(emits[0]).toEqual(createdEmit);
    });

    it('should emit on input', async () => {
        const wrapper = mount(OneTimeCodeFieldItem, {
            props: Object.assign({}, props, { type: 'alpha' }),
            attachTo: document.body
        });

        const input = wrapper.find('input');

        await input.setValue('a');
        expect(input.element.value).toBe('A');

        const emits = emitted(wrapper, 'updated');
        expect(emits[0].value === 'A').toBeTruthy();
    });
});

function mountComponent(): { wrapper: VueWrapper<any>, input: DOMWrapper<HTMLInputElement> } {
    const wrapper = mount(OneTimeCodeFieldItem, {
        props: props,
        attachTo: document.body
    });

    const input = wrapper.find('input') as DOMWrapper<HTMLInputElement>;

    return { wrapper, input };
}
