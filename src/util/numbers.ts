/**
 * Filter out all characters that are not allowed in order to parse it to a number
 *
 * @param value the string to filter
 * @param allowDecimals if `true`, the last separator will be kept. Otherwise all decimal separators will be removed.
 * @param allowNegative if `true`, the leading minus sign will be kept. Otherwise all minus signs will be removed.
 */
function filter(value: string, allowDecimals: boolean, allowNegative: boolean): string | null {
    let filtered = value?.replace(/\s/g, '');
    if (!filtered) {
        return null;
    }

    // Filter out all separators except, if allowed, for the last
    filtered = allowDecimals ? filtered.replace(/[.,](?=.*[.,])/g, '') : filtered.replace(/[.,]/g, '');

    // Filter out all minus signs from the string except, if allowed, the first character
    filtered = allowNegative ? filtered[0] + filtered.slice(1).replace(/-/g, '') : filtered.replace(/-/g, '');

    return filtered;
}

/**
 * Parse the provided string value to a number
 *
 * @param value the string to parse
 * @param allowDecimals if `true`, the last separator will be kept. Otherwise all decimal separators will be removed.
 * @param allowNegative if `true`, the leading minus sign will be kept. Otherwise all minus signs will be removed.
 */
export function parse(value: string, allowDecimals: boolean = true, allowNegative: boolean = true): number | null {
    const filtered = filter(value, allowDecimals, allowNegative);
    if (!filtered) {
        return null;
    }

    const numeric = Number(filtered.replace(',', '.'));
    return !isNaN(numeric) ? numeric : null;
}
