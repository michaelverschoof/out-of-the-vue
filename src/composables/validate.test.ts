import { FieldData } from '@/composables/types';
import { predefinedValidations, useValidate } from '@/composables/validate';
import { describe, expect, it } from 'vitest';

const data: FieldData = {
    name: 'data',
    value: 'some value'
};

describe('Single validation', () => {
    const { validate } = useValidate();

    const required = [ { ...predefinedValidations.required, parameters: [ true ] } ];

    it('should validate when given a value', () => {
        expect(validate(data, required)).toEqual([]);
    });

    it('should validate when given no parameter', () => {
        expect(validate(data, [ { ...predefinedValidations.required, parameters: [] } ])).toEqual([]);
        expect(validate(data, [ { ...predefinedValidations.required, parameters: undefined } ])).toEqual([]);
    });

    it('should validate when required is false', () => {
        expect(validate(data, [ { ...predefinedValidations.required, parameters: [ false ] } ])).toEqual([]);
    });

    it('should not validate with invalid value', () => {
        expect(validate({ name: 'data', value: '' }, required)).toEqual([ 'required' ]);
        expect(validate({ name: 'data', value: null }, required)).toEqual([ 'required' ]);
    });
});

describe('Multiple validations', () => {
    const { validate } = useValidate();

    const validations = [
        { ...predefinedValidations.required, parameters: [ true ] },
        { ...predefinedValidations['min-length'], parameters: [ 5 ] }
    ];

    it('should validate when given a value', () => {
        expect(validate(data, validations)).toEqual([]);
    });

    it('should not validate with invalid values', () => {
        expect(validate({ name: 'data', value: 'abc' }, validations)).toEqual([ 'min' ]);
        expect(validate({ name: 'data', value: null }, validations)).toEqual([ 'required', 'min' ]);
    });
});
