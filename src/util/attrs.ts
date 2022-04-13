type Data = Record<string, unknown>;

/**
 * Filter function for html attributes. Mainly used to use attributes in a parent but not pass them to any children.
 * @param attributes the attributes list
 * @param exclude an array of attribute names to filter out
 */
export function filter(attributes: Data, exclude: string[]): Data {
    if (!attributes || !exclude) {
        return attributes;
    }

    return Object.fromEntries(Object.entries(attributes).filter(([ key ]) => !exclude.includes(key)));
}
