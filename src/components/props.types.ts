import { ValidationMethod } from '@/composables/types';

export const RequiredProps = {
    string: {
        type: String,
        required: true
    }
};

export const OptionalProps = {
    boolean: {
        type: Boolean,
        required: false,
        default: null
    },
    booleanTrue: {
        type: Boolean,
        required: false,
        default: true
    },
    booleanFalse: {
        type: Boolean,
        required: false,
        default: false
    },
    number: {
        type: Number,
        required: false,
        default: null
    },
    string: {
        type: String,
        required: false,
        default: null
    },
    stringArray: {
        type: Array as () => string[],
        required: false,
        default: []
    },
    validations: {
        type: Array as () => ValidationMethod[],
        required: false,
        default: []
    }
};
