import { App } from 'vue';

/**
 * Base component additions
 */
import Counter from './components/form/fields/additions/counter/counter.vue';
import TextCounter from './components/form/fields/additions/counter/text-counter.vue';
import PrependAppend from './components/form/fields/additions/layout/prepend-append.vue';

/**
 * Base components
 */
import CheckableInput from './components/form/fields/base/checkable-input.vue';
import DebounceableInput from './components/form/fields/base/debounceable-input.vue';
import NumericInput from './components/form/fields/base/numeric-input.vue';
import TextInput from './components/form/fields/base/text-input.vue';
import ValidatableInput from './components/form/fields/base/validatable-input.vue';

/**
 * Full components
 */
import CheckableField from './components/form/fields/checkable-field/checkable-field.vue';
import NumberField from './components/form/fields/input-field/number-field.vue';
import OneTimeCodeField from './components/form/fields/input-field/one-time-code-field.vue';
import TextField from './components/form/fields/input-field/text-field.vue';
import Modal from './components/modal.vue';

/**
 * Component exports
 */
export { CheckableField, Modal, NumberField, OneTimeCodeField, TextField };
export { CheckableInput, DebounceableInput, NumericInput, TextInput, ValidatableInput };
export { Counter, PrependAppend, TextCounter };

/**
 * Composables
 */
export { useUserInputDebouncing } from './composables/debounce-user-input';
export { useUserInput } from './composables/user-input';
export { predefinedValidations, useUserInputValidation } from './composables/validate-user-input';

/**
 * Symbols
 */
export { SubmittedSymbol } from './composables/types';

export default {
    install: (app: App) => {
        app.component('Counter', Counter);
        app.component('TextCounter', TextCounter);
        app.component('PrependAppend', PrependAppend);

        app.component('CheckableInput', CheckableInput);
        app.component('DebounceableInput', DebounceableInput);
        app.component('NumericInput', NumericInput);
        app.component('TextInput', TextInput);
        app.component('ValidatableInput', ValidatableInput);

        app.component('CheckableField', CheckableField);
        app.component('Modal', Modal);
        app.component('NumberField', NumberField);
        app.component('OneTimeCodeField', OneTimeCodeField);
        app.component('TextField', TextField);
    }
};
