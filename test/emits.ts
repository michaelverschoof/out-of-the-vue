import { VueWrapper } from '@vue/test-utils';
import { expect } from 'vitest';

export function emitted(wrapper: VueWrapper<any>, event: string = null, count: number = 1): unknown[] {
    const emitted = wrapper.emitted(event);
    if (!event || !count) {
        return emitted;
    }

    expect(emitted).toBeTruthy();
    expect(emitted.length).toBe(count);

    return emitted;
}
