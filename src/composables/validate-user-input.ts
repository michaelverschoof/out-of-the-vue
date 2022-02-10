import { BaseValidation, ValidationMethod, FieldData } from '@/composables/types';

const registry: ValidationMethod[] = [
    {
        name: 'max-length',
        validator: validateMaxLength
    },
    {
        name: 'min-length',
        validator: validateMinLength
    },
    {
        name: 'required',
        validator: validateRequired
    }
];

export const useUserInputValidation = () => {
    /**
     * Validate the field data using the provided base validations and/or
     * @param data the emitted field data
     * @param baseValidations list of registered internal validations
     * @param customValidations list of custom validation methods
     * @returns list of names of failed validations
     */
    const validate = (data: FieldData, baseValidations?: BaseValidation[], customValidations?: ValidationMethod[]): string[] => {
        const failed: string[] = [];

        if (baseValidations) {
            failed.push(...processBaseValidations(data, baseValidations));
        }

        if (customValidations) {
            failed.push(...processValidation(data, customValidations));
        }

        return failed;
    };

    /**
     * Go through the list of provided validations and call the corresponding internal validations
     * @param data the emitted field data
     * @param baseValidations list of registered internal validations
     * @returns list of names of failed validations
     */
    const processBaseValidations = (data: FieldData, baseValidations: BaseValidation[]): string[] => {
        const validations: ValidationMethod[] = [];

        // TODO Reduce?
        for (const validation of baseValidations) {
            const registered = registry.find((item) => item.name === validation.name);
            if (!registered) {
                continue;
            }

            validations.push({
                name: validation.name,
                validator: () => registered.validator(data, validation.parameter)
            });
        }

        return processValidation(data, validations);
    };

    /**
     * Go through the list of provided validations and call the validators
     * @param data the emitted field data
     * @param validations the validation methods to call
     * @returns list of names of failed validations
     */
    const processValidation = (data: FieldData, validations: ValidationMethod[]): string[] => {
        const failed: string[] = [];

        for (const validation of validations) {
            const result = validation.validator(data);
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
 * @param value the value to validate
 * @returns true if the value is not empty or only whitespaces
 */
function validateRequired(data: FieldData): boolean {
    return !!data.value && !!data.value.trim();
}

/**
 * Validate the minimum length of a field
 *
 * @param value the value to validate
 * @param minLength the minimim length the value needs to have
 * @returns true if the value is larger or equal to the minimum length
 */
function validateMinLength(data: FieldData, minLength: number): boolean {
    return !!data.value && data.value.length >= minLength;
}

/**
 * Validate the maximum length of a field
 *
 * @param value the value to validate
 * @param maxLength the maximum length the value may have
 * @returns true if the value is smaller or equal to the maximum length
 */
function validateMaxLength(data: FieldData, maxLength: number): boolean {
    return !!data.value && data.value.length <= maxLength;
}
