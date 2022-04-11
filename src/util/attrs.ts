type Data = Record<string, unknown>;

export function filterAttrs(attrs: Data, exclude: string[]) {
    return Object.fromEntries(Object.entries(attrs).filter(([ key ]) => !exclude.includes(key)));
}
