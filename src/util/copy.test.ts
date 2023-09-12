import { expect, it } from 'vitest';
import { reactive, ref } from 'vue';
import { rawClone } from './copy';

const simpleObject = {
    name: 'simple',
    value: 123
};

const complexObject = {
    name: 'simple',
    value: [1, 2, 56]
};

const complexerObject = {
    name: 'simple',
    value: ref([1, 2, 56]),
    other: reactive({ foo: 'bar' })
};

it('should clone shallow objects', () => {
    expect(rawClone(simpleObject)).toEqual(simpleObject);
    expect(rawClone(reactive(simpleObject))).toEqual(simpleObject);
});

it('should clone complex objects', () => {
    expect(rawClone(complexObject)).toEqual(complexObject);
    expect(rawClone(reactive(complexObject))).toEqual(complexObject);

    const expected = {
        name: 'simple',
        value: [1, 2, 56],
        other: { foo: 'bar' }
    };

    expect(rawClone(complexerObject)).toEqual(expected);
    expect(rawClone(reactive(complexerObject))).toEqual(expected);
});
