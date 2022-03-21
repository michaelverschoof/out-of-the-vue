export const useUserInput = () => {

    const filter = (value: string, regex: string | RegExp): string => {
        return regex ? (value.match(regex) || []).join('') : value;
    };

    return {
        filter
    };
};
