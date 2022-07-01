import { InjectionKey, Ref } from 'vue';

export type BaseValidationType = 'required' | 'required-array' | 'min-length' | 'max-length' | 'min-amount' | 'max-amount' | 'min-array' | 'max-array';

/**
 * Emit event types
 * TODO: These types can only be used with defineEmits after https://github.com/vuejs/core/issues/4294 has been fixed
 * Currently there is no support for importing type literals
 */
export type UpdateEmitType = 'created' | 'updated';
export type FocusEmitType = 'focused' | 'blurred';
export type ModalEmitType = 'opened' | 'closed';

/**
 * Provide / inject Symbols
 */
export const SubmittedSymbol: InjectionKey<Ref<boolean>> = Symbol('submitted');

/**
 * Field state emitted from all inputs
 */
export interface FieldData {
    name: string | null;
    value: string | number | null | (string | null)[] | (number | null)[];
}

export interface StringFieldData extends FieldData {
    value: string | null;
}

export interface NumberFieldData extends FieldData {
    value: number | null;
}

export interface CheckableFieldData extends FieldData {
    value: string;
    checked: boolean;
}

/**
 * Extended field state emitted from validatable inputs
 */
export interface ValidatedFieldData extends FieldData {
    valid: boolean;
    failed: (string | BaseValidationType)[];
}

export interface ValidatedStringArrayFieldData extends ValidatedFieldData {
    value: (string | null)[];
}

export interface ValidatedStringFieldData extends ValidatedFieldData {
    value: string;
}

export interface ValidatedNumberFieldData extends ValidatedFieldData {
    value: number;
}

/**
 * Validation method structure used by internally registered validation methods and provided custom validations
 */
export interface ValidationMethod {
    name: BaseValidationType | string;
    validator: (data: FieldData, ...parameters: ValidationMethodParameters) => boolean;
    parameters?: ValidationMethodParameters;
}

export type ValidationMethodParameters = (string | number | boolean | undefined)[];
