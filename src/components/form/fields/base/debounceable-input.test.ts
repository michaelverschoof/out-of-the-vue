import DebounceableInput from '@/components/form/fields/base/debounceable-input.vue';
import { emitted } from '@test/emits';
import { MountedComponent } from '@test/types';
import { mount } from '@vue/test-utils';
import { afterEach, beforeAll, expect, it, vi } from 'vitest';

/**
 * @vitest-environment happy-dom
 */

const data = { name: 'test', value: 'foo' };
const stringedData = JSON.stringify(data).replace(/"/g, '\'');

vi.useFakeTimers();

beforeAll(() => {
    expect(DebounceableInput).toBeTruthy();
});

afterEach(() => {
    vi.clearAllTimers();
});

it('should mount the component', async () => {
    const { wrapper } = mountComponent();
    expect(wrapper.html()).toBe('<div>Foo</div>');
});

it('should trigger debounce', async () => {
    const { element, wrapper } = mountComponent();

    await element.trigger('debounce');
    expect(wrapper.emitted('updated')).toBeFalsy();

    vi.advanceTimersToNextTimer();

    const emits = emitted(wrapper, 'updated');
    expect(emits[0]).toEqual(data);
});

it('should trigger debounce immediately without delay set', async () => {
    const { element, wrapper } = mountComponent(0);

    await element.trigger('debounce');
    const emits = emitted(wrapper, 'updated');
    expect(emits[0]).toEqual(data);
});

function mountComponent(delay: number = 10): MountedComponent {
    const wrapper = mount(DebounceableInput, {
        slots: {
            default: `<template #default="{ debounce }">
                        <div @debounce="debounce(${ stringedData })">Foo</div>
                      </template>`
        },
        props: {
            delay: delay
        }
    });

    const element = wrapper.find('div');

    return { wrapper, element };
}
