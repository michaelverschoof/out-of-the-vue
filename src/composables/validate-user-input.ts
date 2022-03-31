import { BaseValidationType, FieldData, ValidationMethod } from '@/composables/types';

type BaseValidationRegistry = {
    [key in BaseValidationType]: ValidationMethod
}

/**
 * Registry of pre-defined validation methods
 */
export const predefinedValidations: BaseValidationRegistry = {
    'max-length': {
        name: 'max',
        validator: validateMaxLength
    },
    'min-length': {
        name: 'min',
        validator: validateMinLength
    },
    'required': {
        name: 'required',
        validator: validateRequired
    },
    'required-array': {
        name: 'required',
        validator: validateRequiredArray
    },
    'max-amount': {
        name: 'max',
        validator: validateMaxAmount
    },
    'min-amount': {
        name: 'min',
        validator: validateMinAmount
    },
    'min-array': {
        name: 'min',
        validator: validateMinArray
    },
    'max-array': {
        name: 'max',
        validator: validateMaxArray
    }
};

export const useUserInputValidation = () => {
    /**
     * Validate the field data using the provided validations
     *
     * @param data the emitted field data
     * @param validations list of validations
     * @returns list of names of failed validations
     */
    const validate = (data: FieldData, validations?: ValidationMethod[]): string[] => {
        const failed: string[] = [];

        for (const validation of validations) {
            const result = validation.validator(data, ...(validation.parameters || []));
            if (result) {
                continue;
            }

            failed.push(validation.name);
        }

        return failed;
    };

    return {
        validate
    };
};

/**
 * Validate a required field
 *
 * @param data the field data to validate
 * @param required if the field is required
 * @returns true if the value is not empty
 */
function validateRequired(data: FieldData, required: boolean): boolean {
    return !required || (!!data.value || data.value === 0);
}

/**
 * Validate a required array
 *
 * @param data the field data to validate
 * @param required if the field is required
 * @returns true if the value is not empty, and contains non-null values
 */
function validateRequiredArray(data: FieldData, required: boolean): boolean {
    const value = <(string | number)[]> data.value;
    return !required || (!!value && !!value.length && value.every(val => val !== null));
}

/**
 * Validate the minimum length of a field
 *
 * @param data the field data to validate
 * @param length the minimum length the value needs to have
 * @returns true if the value is larger or equal to the minimum length
 */
function validateMinLength(data: FieldData, length: number): boolean {
    return !length || ((!!<string> data.value) && (<string> data.value).length >= length);
}

/**
 * Validate the maximum length of a field
 *
 * @param data the field data to validate
 * @param length the maximum length the value may have
 * @returns true if the value is smaller or equal to the maximum length
 */
function validateMaxLength(data: FieldData, length: number): boolean {
    return !length || ((!!<string> data.value) && (<string> data.value).length <= length);
}

/**
 * Validate the minimum value of a numeric field
 *
 * @param data the field data to validate
 * @param amount the minimum amount the value needs to be
 * @returns true if the value is greater or equal to the minimum amount
 */
function validateMinAmount(data: FieldData, amount: number): boolean {
    return !amount || (data.value || 0) >= amount;
}

/**
 * Validate the maximum value of a numeric field
 *
 * @param data the field data to validate
 * @param amount the maximum amount the value can be
 * @returns true if the value is smaller or equal to the maximum amount
 */
function validateMaxAmount(data: FieldData, amount: number): boolean {
    return !amount || (data.value || 0) <= amount;
}

/**
 * Validate the minimum amount of items in an array
 *
 * @param data the field data to validate
 * @param amount the minimum amount of items required
 * @returns true if the length is greater or equal to the minimum amount
 */
function validateMinArray(data: FieldData, amount: number): boolean {
    return !amount || ((<(string | number)[]> data.value).length || 0) >= amount;
}

/**
 * Validate the maximum amount of items in an array
 *
 * @param data the field data to validate
 * @param amount the maximum amount of items allowed
 * @returns true if the length is smaller or equal to the maximum amount
 */
function validateMaxArray(data: FieldData, amount: number): boolean {
    return !amount || ((<(string | number)[]> data.value).length || 0) <= amount;
}
