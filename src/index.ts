import { FocusEmitType, ModalEmitType, UpdateEmitType } from '@/composables/types';

/**
 * Full components
 */
export { default as Modal } from '@/components/modal.vue';
export { default as CheckableField } from '@/components/form/fields/checkable-field/checkable-field.vue';
export { default as TextField } from '@/components/form/fields/input-field/text-field.vue';
export { default as NumberField } from '@/components/form/fields/input-field/number-field.vue';
export { default as OneTimeCode } from '@/components/form/fields/input-field/one-time-code-field.vue';

/**
 * Base field components
 */
export { default as CheckableInput } from '@/components/form/fields/base/checkable-input.vue';
export { default as TextInput } from '@/components/form/fields/base/text-input.vue';
export { default as NumericInput } from '@/components/form/fields/base/numeric-input.vue';
export { default as DebounceableInput } from '@/components/form/fields/base/debounceable-input.vue';
export { default as ValidatableInput } from '@/components/form/fields/base/validatable-input.vue';


/**
 * Base component additions
 */
export { default as Counter } from '@/components/form/fields/additions/counter/counter.vue';
export { default as TextCounter } from '@/components/form/fields/additions/counter/text-counter.vue';
export { default as PrependAppend } from '@/components/form/fields/additions/layout/prepend-append.vue';

/**
 * Types
 */
export { FieldData, CheckableFieldData, NumberFieldData, StringFieldData, ValidatedFieldData, ValidationMethod } from '@/composables/types';
export type EmitType = UpdateEmitType | FocusEmitType | ModalEmitType;

/**
 * Composables
 */
export { useUserInputDebouncing } from '@/composables/debounce-user-input';
export { useUserInput } from '@/composables/user-input';
export { predefinedValidations, useUserInputValidation } from '@/composables/validate-user-input';

