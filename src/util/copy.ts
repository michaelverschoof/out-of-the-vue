import { isReactive, toRaw } from 'vue';

function isObject(value: unknown): boolean {
    return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function getRawData<T>(data: T): T {
    return isReactive(data) ? toRaw(data) : data;
}

export function rawClone<T>(data: T): T {
    const rawData = getRawData<T>(data);

    for (const key in rawData) {
        const value = rawData[key];

        if (!isObject(value) && !Array.isArray(value)) {
            continue;
        }

        rawData[key] = rawClone<typeof value>(value);
    }

    // return rawData; // much better:
    return structuredClone(rawData);
}
