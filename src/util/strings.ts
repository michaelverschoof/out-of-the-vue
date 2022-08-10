export type InputTransformType = 'uppercase' | 'lowercase';

/**
 * Filter out all characters that are not allowed
 * @param value
 * @param regex
 */
export function filter(value: string, regex: string | RegExp): string | null {
    if (!value) {
        return null;
    }
    return regex ? (value.match(regex) || []).join('') : value;
}

/**
 * Transform the given string to either uppercase or lowercase
 * @param value
 * @param type
 */
export function transform(value: string, type: InputTransformType): string | null {
    if (!value) {
        return null;
    }
    return type === 'uppercase' ? value.toUpperCase() : value.toLowerCase();
}

/**
 * Shorten the given value to the given length
 * @param value
 * @param length
 */
export function shorten(value: string, length?: number): string | null {
    if (!value) {
        return null;
    }
    if (!length) {
        return value;
    }
    return value.slice(0, length);
}
