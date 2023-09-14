import { isReactive, isRef, toRaw } from 'vue';

/**
 * Check if a value is an object
 *
 * @param value the object to check
 */
function isObject(value: unknown): boolean {
    return value !== null && !Array.isArray(value) && typeof value === 'object';
}

/**
 * Convert a Vue object to its raw data, if needed
 *
 * @param data the object to convert
 */
function getRawData<T>(data: T): T {
    return isReactive(data) ? { ...toRaw(data) } : isRef<T>(data) ? JSON.parse(JSON.stringify(data.value)) : data;
}

/**
 * Create a deep clone of the provided object, without reactivity
 *
 * @param data the object to clone
 */
export function rawClone<T>(data: T): T {
    const rawData = getRawData<T>(data);

    for (const key in rawData) {
        const value = rawData[key];

        if (!isObject(value) && !Array.isArray(value)) {
            continue;
        }

        rawData[key] = rawClone<typeof value>(value);
    }

    return rawData;
}
