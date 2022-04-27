import { FieldData } from '@/composables/types';

/**
 * Validate a required array
 *
 * @param data the field data to validate
 * @param required if the field is required
 * @returns true if the value is not empty, and contains non-null values
 */
export function required(data: FieldData, required: boolean = true): boolean {
    const value = getValue(data);
    return !required || (!!value.length && value.every(val => val !== undefined && val !== null));
}

/**
 * Validate the minimum amount of items in an array
 *
 * @param data the field data to validate
 * @param amount the minimum amount of items required
 * @returns true if the length is greater or equal to the minimum amount
 */
export function minimum(data: FieldData, amount: number): boolean {
    return !amount || getValue(data).length >= amount;
}

/**
 * Validate the maximum amount of items in an array
 *
 * @param data the field data to validate
 * @param amount the maximum amount of items allowed
 * @returns true if the length is smaller or equal to the maximum amount
 */
export function maximum(data: FieldData, amount: number): boolean {
    return !amount || getValue(data).length <= amount;
}

/**
 * Get the value from field data
 * @param data the field data that holds the value
 */
function getValue(data: FieldData): (string | number)[] {
    return <(string | number)[]> data?.value || [];
}
