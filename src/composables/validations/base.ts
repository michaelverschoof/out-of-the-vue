import { FieldData } from '@/composables/types';

/**
 * Validate a required field
 *
 * @param data the field data to validate
 * @param required if the field is required
 * @returns true if the value is not empty
 */
export function required(data: FieldData, required: boolean = true): boolean {
    return !required || (!!data && (!!data.value || data.value === 0));
}

/**
 * Validate the minimum length of a field
 *
 * @param data the field data to validate
 * @param length the minimum length the value needs to have
 * @returns true if the value is larger or equal to the minimum length
 */
export function minimum(data: FieldData, length: number): boolean {
    const value = getValue(data);
    return !length || (!!value && value.length >= length);
}

/**
 * Validate the maximum length of a field
 *
 * @param data the field data to validate
 * @param length the maximum length the value may have
 * @returns true if the value is smaller or equal to the maximum length
 */
export function maximum(data: FieldData, length: number): boolean {
    const value = getValue(data);
    return !length || (!!value && value.length <= length);
}

/**
 * Get the value from field data
 * @param data the field data that holds the value
 */
function getValue(data: FieldData): string {
    return <string> data?.value || '';
}
