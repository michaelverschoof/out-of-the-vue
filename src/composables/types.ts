export type BaseValidationType = 'required' | 'required-array' | 'min-length' | 'max-length' | 'min-amount' | 'max-amount' | 'min-array' | 'max-array';

export type InputTransformType = 'uppercase' | 'lowercase';

/**
 * Emit event types
 */
export type UpdateEmitType = 'created' | 'updated';
export type FocusEmitType = 'focused' | 'blurred';
export type ModalEmitType = 'opened' | 'closed';

/**
 * Field state emitted from all inputs
 */
export interface FieldData {
    name: string;
    value: string | number | string[] | number[];
}

export interface StringFieldData extends FieldData {
    value: string;
}

export interface NumberFieldData extends FieldData {
    value: number;
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
    failed: Array<string | BaseValidationType>;
}

/**
 * Validation method structure used by internally registered validation methods and provided custom validations
 */
export interface ValidationMethod {
    name: BaseValidationType | string;
    validator: (data: FieldData, ...parameters: ValidationMethodParameters) => boolean;
    parameters?: ValidationMethodParameters;
}

type ValidationMethodParameters = Array<string | number | boolean>;
