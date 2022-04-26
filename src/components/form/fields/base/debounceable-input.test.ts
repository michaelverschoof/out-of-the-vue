import DebounceableInput from '@/components/form/fields/base/debounceable-input.vue';
import { emitted } from '@test/emits';
import { MountedComponent } from '@test/types';
import { mount } from '@vue/test-utils';
import { afterEach, beforeAll, expect, it, vi } from 'vitest';

/**
 * @vitest-environment happy-dom
 */

const data = { name: 'test', value: 'foo' };

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
    const { wrapper } = mountComponent();

    await wrapper.find('div').trigger('click');
    expect(wrapper.emitted('updated')).toBeFalsy();

    vi.advanceTimersToNextTimer();

    const emits = emitted(wrapper, 'updated');
    expect(emits[0]).toEqual(data);
});

it('should trigger debounce immediately without delay set', async () => {
    const { wrapper } = mountComponent(0);

    await wrapper.find('div').trigger('click');
    const emits = emitted(wrapper, 'updated');
    expect(emits[0]).toEqual(data);
});

function mountComponent(delay: number = 10): MountedComponent {
    const wrapper = mount(DebounceableInput, {
        slots: {
            default: `<template #default="{ debounce }">
                        <div @click="debounce(${ JSON.stringify(data).replace(/"/g, '\'') })">Foo</div>
                      </template>`
        },
        props: {
            delay: delay
        }
    });

    return { wrapper };
}
