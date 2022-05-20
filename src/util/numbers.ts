/**
 * Filter out all characters that are not allowed in order to parse it to a number
 * @param value
 * @param allowDecimals
 * @param allowNegative
 */
export function filter(value: string, allowDecimals: boolean = true, allowNegative: boolean = true): string {
    let filtered = value?.replace(/\s/g, '');
    if (!filtered) {
        return null;
    }

    // Filter out all separators except, if allowed, for the last
    filtered = allowDecimals
        ? filtered.replace(/[.,](?=.*[.,])/g, '')
        : filtered.replace(/[.,]/g, '');

    // Filter out all minus signs from the string except, if allowed, the first character
    filtered = allowNegative
        ? filtered[0] + filtered.slice(1).replace(/-/g, '')
        : filtered.replace(/-/g, '');

    return filtered;
}

/**
 * Parse the provided string value to a number
 * @param value
 */
export function parse(value: string): number {
    if (!value) {
        return null;
    }

    const numeric = Number(value.replace(',', '.'));
    return !isNaN(numeric) ? numeric : null;
}
