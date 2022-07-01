import { BaseValidationType, FieldData, ValidationMethod, ValidationMethodParameters } from '@/composables/types';
import { maximum as maximumAmount, minimum as minimumAmount } from '@/composables/validations/amount';
import { maximum as maximumArray, minimum as minimumArray, required as requiredArray } from '@/composables/validations/array';
import { maximum as maximumLength, minimum as minimumLength, required } from '@/composables/validations/base';

type BaseValidationRegistry = {
    [key in BaseValidationType]: ValidationMethod
}

/**
 * Registry of pre-defined validation methods
 */
export const predefinedValidations: BaseValidationRegistry = {
    'required': {
        name: 'required',
        validator: (data: FieldData, ...parameters: ValidationMethodParameters) => required(data, parameters[0] as boolean ?? null)
    },
    'max-length': {
        name: 'max',
        validator: (data: FieldData, ...parameters: ValidationMethodParameters) => maximumLength(data, parameters[0] as number ?? null)
    },
    'min-length': {
        name: 'min',
        validator: (data: FieldData, ...parameters: ValidationMethodParameters) => minimumLength(data, parameters[0] as number ?? null)
    },
    'max-amount': {
        name: 'max',
        validator: (data: FieldData, ...parameters: ValidationMethodParameters) => maximumAmount(data, parameters[0] as number ?? null)
    },
    'min-amount': {
        name: 'min',
        validator: (data: FieldData, ...parameters: ValidationMethodParameters) => minimumAmount(data, parameters[0] as number ?? null)
    },
    'required-array': {
        name: 'required',
        validator: (data: FieldData, ...parameters: ValidationMethodParameters) => requiredArray(data, parameters[0] as boolean ?? null)
    },
    'min-array': {
        name: 'min',
        validator: (data: FieldData, ...parameters: ValidationMethodParameters) => minimumArray(data, parameters[0] as number ?? null)
    },
    'max-array': {
        name: 'max',
        validator: (data: FieldData, ...parameters: ValidationMethodParameters) => maximumArray(data, parameters[0] as number ?? null)
    }
};

export const useValidate = () => {
    /**
     * Validate the field data using the provided validations
     *
     * @param data the emitted field data
     * @param validations list of validations
     * @returns list of names of failed validations
     */
    const validate = (data: FieldData, validations: ValidationMethod[] = []): string[] => {
        const failed: Set<string> = new Set();

        for (const validation of validations) {
            const result = validation.validator(data, ...(validation.parameters || []));

            result ? failed.delete(validation.name) : failed.add(validation.name);
        }

        return Array.from(failed);
    };

    return {
        validate
    };
};
