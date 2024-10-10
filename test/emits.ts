import { CheckableFieldData, FieldData, ValidatedFieldData } from '@/composables/types';
import { VueWrapper } from '@vue/test-utils';
import { expect } from 'vitest';

type EmittedFieldData = (FieldData | CheckableFieldData | ValidatedFieldData)[];

export function emitted(
    wrapper: VueWrapper<any>,
    event: string = null,
    count: number = 1
): FieldData[] | CheckableFieldData[] | ValidatedFieldData[] {
    if (!event || !count) {
        return null;
    }

    const emitted = wrapper.emitted(event) as EmittedFieldData[];
    expect(emitted).toBeTruthy();
    expect(emitted[0]).toBeTruthy();
    expect(emitted.length).toBe(count);

    const events = emitted.reduce(
        (events: EmittedFieldData, event: EmittedFieldData) => {
            events.push(event[0]);
            return events;
        },
        [] as FieldData[] | CheckableFieldData[] | ValidatedFieldData[]
    );

    return events as FieldData[] | CheckableFieldData[] | ValidatedFieldData[];
}

export function emittedNativeEvents<T extends Event>(
    wrapper: VueWrapper<any>,
    event: string = null,
    count: number = 1
): T[] {
    if (!event || !count) {
        return null;
    }

    const emitted: T[][] = wrapper.emitted(event);
    if (!emitted || !emitted.length) {
        return null;
    }

    const emittedValues = emitted.flatMap((emits) => emits);
    expect(emittedValues).toBeTruthy();
    expect(emittedValues.length).toBe(count);

    return emittedValues;
}

type CustomEventValue = string | boolean | [];

export function emittedCustomEvents(
    wrapper: VueWrapper<any>,
    event: string = null,
    count: number = 1
): CustomEventValue[] {
    if (!event || !count) {
        return null;
    }

    const emitted: CustomEventValue[][] = wrapper.emitted(event);
    if (count === 0 && (!emitted || !emitted.length)) {
        return null;
    }

    expect(emitted).toBeTruthy();

    const emittedValues = emitted.flatMap((emits) =>
        Array.isArray(emits) && emits.length === 0 ? true : emits
    );
    expect(emittedValues).toBeTruthy();
    expect(emittedValues.length).toBe(count);

    return emittedValues;
}
