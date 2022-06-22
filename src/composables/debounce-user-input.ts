const DELAY = 400;

export const useUserInputDebouncing = () => {
    let timer: number | null;

    /**
     * Delay the callback by the amount provided. Meant for delaying user input processing.
     * @param callback the method to call once the delay triggers
     * @param delay the amount of milliseconds to wait until triggering the callback
     */
    const debounce = (callback: () => void, delay: number = DELAY): void => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }

        timer = setTimeout((() => {
            callback();
        }) as TimerHandler, delay);
    };

    return {
        debounce
    };
};
