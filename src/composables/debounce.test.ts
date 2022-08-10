import { useDebounce } from '@/composables/debounce';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('Debounce', () => {
    vi.useFakeTimers();

    const { debounce } = useDebounce();

    afterEach(() => {
        vi.clearAllTimers();
    });

    it('should execute the callback after the delay', () => {
        const callback = vi.fn();

        debounce(callback, 10);
        vi.advanceTimersToNextTimer();

        expect(callback).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledOnce();
    });

    it('should clear the timer when called multiple times', () => {
        const callback = vi.fn();

        debounce(callback, 10);
        debounce(callback, 15);
        vi.advanceTimersToNextTimer();

        expect(callback).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledOnce();
    });

    it('should trigger after 400 milliseconds if no delay is provided', () => {
        const callback = vi.fn();

        debounce(callback);
        vi.advanceTimersByTime(400);

        expect(callback).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should trigger after 400 milliseconds if delay is null', () => {
        const callback = vi.fn();

        debounce(callback, undefined);
        vi.advanceTimersByTime(400);

        expect(callback).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledTimes(1);
    });
});
