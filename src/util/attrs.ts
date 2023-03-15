type Data = Record<string, unknown>;

/**
 * Filter function for attributes, properties and event handlers.
 * Mainly used to use attributes in a parent but not pass them to any children or the other way around.
 *
 * @param attributes the attributes list
 * @param exclude an array of attribute names to filter out
 */
export function exclude(attributes: Data, exclude: string[]): Data {
    if (!attributes || !exclude) {
        return attributes;
    }

    return Object.keys(attributes).reduce((entries: Data, key: string) => {
        if (exclude.includes(key)) {
            return entries;
        }

        entries[key] = attributes[key];
        return entries;
    }, {});
}

/**
 * Filter function for attributes, properties and event handlers.
 * Mainly used to use attributes in a parent but not pass them to any children or the other way around.
 *
 * @param attributes the attributes list
 * @param include an array of attribute names to not filter out
 */
export function include(attributes: Data, include: string[]): Data {
    if (!attributes || !include) {
        return attributes;
    }

    return Object.keys(attributes).reduce((entries: Data, key: string) => {
        if (!include.includes(key)) {
            return entries;
        }

        entries[key] = attributes[key];
        return entries;
    }, {});
}
