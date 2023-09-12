import { beforeAll, expect, it } from 'vitest';
import { ref } from 'vue';
import { hasFocus } from './focus';

/**
 * @vitest-environment happy-dom
 */

beforeAll(() => {
    document.body.innerHTML = `
        <div>
            <span id="span" tabindex="-1">test</span>
            <input id="input" type="text" />
        </div>
    `;
});

it('should return true when an element has focus', () => {
    const text = document.getElementById('span');
    const input = ref<HTMLElement>(document.getElementById('input'));

    expect(hasFocus(text, input)).toBeFalsy();

    text.focus();
    expect(hasFocus(input)).toBeFalsy();
    expect(hasFocus(text)).toBeTruthy();

    input.value.focus();
    expect(hasFocus(text)).toBeFalsy();
    expect(hasFocus(input)).toBeTruthy();
});

it('should return false when no elements are provided', () => {
    expect(hasFocus()).toBeFalsy();
    expect(hasFocus(null)).toBeFalsy();
    expect(hasFocus(undefined)).toBeFalsy();
    expect(hasFocus(null, null)).toBeFalsy();
});
