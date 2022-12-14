import { FieldData } from '@/composables/types';

/**
 * Validate the minimum value of a numeric field
 *
 * @param data the field data to validate
 * @param minimum the minimum amount the value needs to be
 * @returns true if the value is greater or equal to the minimum amount
 */
export function minimum(data: FieldData, minimum: number): boolean {
    return !minimum || (data?.value || 0) >= minimum;
}

/**
 * Validate the maximum value of a numeric field
 *
 * @param data the field data to validate
 * @param maximum the maximum amount the value can be
 * @returns true if the value is smaller or equal to the maximum amount
 */
export function maximum(data: FieldData, maximum: number): boolean {
    return !maximum || (data?.value || 0) <= maximum;
}
