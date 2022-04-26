import { CheckableFieldData, FieldData, ValidatedFieldData } from '@/composables/types';
import { VueWrapper } from '@vue/test-utils';
import { expect } from 'vitest';

export function emitted(wrapper: VueWrapper<any>, event: string = null, count: number = 1): FieldData[] | CheckableFieldData[] | ValidatedFieldData[] {
    if (!event || !count) {
        return null;
    }

    const emitted = wrapper.emitted(event);
    expect(emitted).toBeTruthy();
    expect(emitted[0]).toBeTruthy();
    expect(emitted.length).toBe(count);

    const events = emitted.reduce(
        (events: FieldData[] | CheckableFieldData[] | ValidatedFieldData[], event: FieldData | CheckableFieldData | ValidatedFieldData) => {
            events.push(event[0]);
            return events;
        }, [] as (FieldData[] | CheckableFieldData[] | ValidatedFieldData[])
    );

    return events as FieldData[] | CheckableFieldData[] | ValidatedFieldData[];
}
