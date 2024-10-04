export type TransformFunction = (value: string) => string;

export type AllowedFilters = FilterPreset | RegExp | TransformFunction;

export type AllowedModifiers = ModifierPreset | TransformFunction;

type FilterPreset = 'letters' | 'numbers' | string;
const FilterPresets: Record<FilterPreset, TransformFunction> = {
    letters: (value: string) => (value.match(/[^A-Za-z]/g) || []).join(''),
    numbers: (value: string) => (value.match(/[^0-9]/g) || []).join('')
};

type ModifierPreset = 'uppercase' | 'lowercase' | string;
const ModifierPresets: Record<ModifierPreset, TransformFunction> = {
    uppercase: (value: string) => value.toUpperCase(),
    lowercase: (value: string) => value.toLowerCase()
};

/**
 * Create filter functions from the provided filters
 *
 * @param filters one or multiple presets, regular expressions or functions
 * @returns an array of filter functions
 */
export function createFilters(filters: AllowedFilters | AllowedFilters[]): TransformFunction[] {
    if (!filters) {
        return [];
    }

    const filterArray = Array.isArray(filters) ? filters : [filters];
    if (!filterArray.length) {
        return [];
    }

    const filterFunctions = [];

    for (const filter of filterArray) {
        // FIXME: Check function more specifically
        if (typeof filter === 'function') {
            filterFunctions.push(filter);
            continue;
        }

        if (filter instanceof RegExp) {
            filterFunctions.push((value: string) => (value.match(filter) || []).join(''));
            continue;
        }

        if (typeof filter === 'string') {
            if (!Object.keys(FilterPresets).includes(filter)) {
                console.warn('Unknown filter preset provided');
                continue;
            }

            filterFunctions.push(FilterPresets[filter]);
            continue;
        }

        console.warn('Unknown filter provided');
    }

    return filterFunctions;
}

/**
 * Create modifier functions from the provided modifiers
 *
 * @param modifiers one or multiple presets or functions
 * @returns an array of modifier functions
 */
export function createModifiers(
    modifiers: AllowedModifiers | AllowedModifiers[]
): TransformFunction[] {
    if (!modifiers || !modifiers.length) {
        return [];
    }

    const modifierArray = Array.isArray(modifiers) ? modifiers : [modifiers];

    const modifierFunctions = [];

    for (const modifier of modifierArray) {
        // FIXME: Check function more specifically
        if (typeof modifier === 'function') {
            modifierFunctions.push(modifier);
            continue;
        }

        if (typeof modifier === 'string') {
            if (!Object.keys(ModifierPresets).includes(modifier)) {
                console.warn('Unknown modifier preset provided');
                continue;
            }

            modifierFunctions.push(ModifierPresets[modifier]);
            continue;
        }

        console.warn('Unknown modifier provided');
    }

    return modifierFunctions;
}

/**
 * Teansform a value using the provided functions
 *
 * @param value the value to transform
 * @param transformers the array or transformers to execute
 * @returns the transformed value
 */
export function transform(value: string, ...transformers: TransformFunction[]): string {
    if (!value) {
        return '';
    }

    const filtered = transformers.filter((transformer) => !!transformer);
    if (!filtered || !filtered.length) {
        return value;
    }

    let transformed = value;
    for (const transformer of filtered) {
        transformed = transformer(transformed);
    }

    return transformed;
}
