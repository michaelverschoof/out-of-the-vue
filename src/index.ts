import { InputTransformType } from '@/util/strings';
import { App } from 'vue';

/**
 * Simple components
 */
import Counter from './components/counter/counter.vue';
import TextCounter from './components/counter/text-counter.vue';

/**
 * Base components
 */
import CheckableInput from './components/form/fields/base/checkable-input.vue';
import NumericInput from './components/form/fields/base/numeric-input.vue';
import TextInput from './components/form/fields/base/text-input.vue';
import CheckableFieldModal from './components/form/fields/checkable-field/checkable-field-modal.vue';

/**
 * Full components
 */
import CheckableField from './components/form/fields/checkable-field/checkable-field.vue';
import NumberField from './components/form/fields/input-field/number-field.vue';
import OneTimeCodeField from './components/form/fields/input-field/one-time-code-field.vue';
import TextField from './components/form/fields/input-field/text-field.vue';
import PrependAppend from './components/layout/prepend-append.vue';
import Modal from './components/modal.vue';

/**
 * Types
 */
import { BaseValidationType, CheckableFieldData, FieldData, NumberFieldData, StringFieldData, ValidatedFieldData, ValidatedNumberFieldData, ValidatedStringArrayFieldData, ValidatedStringFieldData, ValidationMethod, ValidationMethodParameters } from './composables/types';

/**
 * Functional components
 */
import Debouncer from './functionals/debouncer.vue';
import Validator from './functionals/validator.vue';

/**
 * Component exports
 */
export { CheckableField, CheckableFieldModal, Modal, NumberField, OneTimeCodeField, TextField };
export { CheckableInput, NumericInput, TextInput };
export { Counter, PrependAppend, TextCounter };

/**
 * Functional component exports
 */
export { Debouncer, Validator };

/**
 * Composables
 */
export { useDebounce } from './composables/debounce';
export { predefinedValidations, useValidate } from './composables/validate';

/**
 * Types
 */
export type {
    BaseValidationType,
    InputTransformType,
    FieldData,
    StringFieldData,
    NumberFieldData,
    CheckableFieldData,
    ValidatedFieldData,
    ValidatedNumberFieldData,
    ValidatedStringFieldData,
    ValidatedStringArrayFieldData,
    ValidationMethod,
    ValidationMethodParameters
};

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
        app.component('NumericInput', NumericInput);
        app.component('TextInput', TextInput);

        app.component('Debouncer', Debouncer);
        app.component('Validator', Validator);

        app.component('CheckableField', CheckableField);
        app.component('Modal', Modal);
        app.component('NumberField', NumberField);
        app.component('OneTimeCodeField', OneTimeCodeField);
        app.component('TextField', TextField);
    }
};
