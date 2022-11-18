export function toggleDecimalInValue(value: number, previousDecimalPosition?: number): { value: number; index: number } {
    const current = value.toString().replace(',', '.');
    const index = current.indexOf('.');
    if (index === -1) {
        if (previousDecimalPosition && current.length > previousDecimalPosition) {
            return {
                value: Number(injectDecimal(current, previousDecimalPosition)),
                index: previousDecimalPosition
            };
        }

        return {
            value: Number(current.length > 2 ? injectDecimal(current, -2) : current + '.12'),
            index: previousDecimalPosition
        };
    }

    return {
        value: Number(current.replace('.', '')),
        index: index
    };
}

export function toggleMinusInValue(value: number): number {
    const current = value.toString();
    if (current.startsWith('-')) {
        return Number(current.slice(1));
    }

    return Number('-' + current);
}

function injectDecimal(value: string, index: number) {
    return value.slice(0, index) + '.' + value.slice(index);
}
