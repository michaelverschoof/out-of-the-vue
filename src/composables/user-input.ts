import { InputTransformType } from '@/composables/types';

export const useUserInput = () => {

    const filter = (value: string, regex: string | RegExp): string => {
        if (!value) {
            return null;
        }
        return regex ? (value.match(regex) || []).join('') : value;
    };

    const transform = (value: string, type: InputTransformType) => {
        if (!value) {
            return null;
        }
        return type === 'uppercase' ? value.toUpperCase() : value.toLowerCase();
    };

    return {
        filter,
        transform
    };
};
