export type BaseValidationType = 'required' | 'min-length' | 'max-length' | 'min-amount' | 'max-amount';

/**
 * Field state emitted from all inputs
 */
export interface FieldData {
    name: string;
    value: string | number;
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
