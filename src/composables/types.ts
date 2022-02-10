type BaseValidationType = 'required' | 'min-length' | 'max-length';

/**
 * Field state emitted from all inputs
 */
export interface FieldData {
    name: string;
    value: string;
}

/**
 * Extended field state emitted from validatable inputs
 */
export interface ValidatedFieldData extends FieldData {
    valid: boolean;
    failed: Array<string | BaseValidationType>;
}

/**
 * Call data for internally registered validation methods
 */
export interface BaseValidation {
    name: BaseValidationType;
    parameter?: string | number;
}

/**
 * Validation method structure used by internally registered validation methods and provided custom validations
 */
export interface ValidationMethod {
    name: BaseValidationType | string;
    validator: (data: FieldData, ...parameters: Array<string | number>) => boolean;
}
