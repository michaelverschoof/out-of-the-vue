import { BaseValidationType, FieldData, ValidationMethod } from '@/composables/types';
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
        validator: required
    },
    'max-length': {
        name: 'max',
        validator: maximumLength
    },
    'min-length': {
        name: 'min',
        validator: minimumLength
    },
    'max-amount': {
        name: 'max',
        validator: maximumAmount
    },
    'min-amount': {
        name: 'min',
        validator: minimumAmount
    },
    'required-array': {
        name: 'required',
        validator: requiredArray
    },
    'min-array': {
        name: 'min',
        validator: minimumArray
    },
    'max-array': {
        name: 'max',
        validator: maximumArray
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
    const validate = (data: FieldData, validations: ValidationMethod[] = []): string[] => {
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
