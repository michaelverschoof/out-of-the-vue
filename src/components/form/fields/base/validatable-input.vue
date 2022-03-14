<template>
    <slot v-bind="$attrs" :validate="validate" :error="!state.valid" />

    <template v-if="!state.valid && showValidations" v-for="validation of validations">
        <strong v-if="show(validation.name)" class="validation-error">
            <slot :name="validation.name" />
        </strong>
    </template>
</template>

<script lang="ts" setup>
import { EmitEvents } from '@/components/types';
import { FieldData, ValidatedFieldData, ValidationMethod } from '@/composables/types';
import { useUserInputValidation } from '@/composables/validate-user-input';
import { reactive } from 'vue';

const emit = defineEmits<{ (event: EmitEvents.UPDATED, data: ValidatedFieldData): void; }>();

const props = defineProps({
    validations: {
        type: Array as () => ValidationMethod[],
        required: false,
        default: []
    },
    showValidations: {
        type: Boolean,
        required: false,
        default: false
    },
    showAllValidations: {
        type: Boolean,
        required: false,
        default: false
    }
});

const state = reactive<ValidatedFieldData>({
    name: null,
    value: null,
    valid: false,
    failed: []
});

const { validate: validateInput } = useUserInputValidation();

const validate = (data: FieldData): void => {
    state.name = data.name;
    state.value = data.value;

    if (!props.validations || !props.validations.length) {
        state.valid = true;
        state.failed = null;
        return emit(EmitEvents.UPDATED, state);
    }

    const failedValidations = validateInput(data, props.validations);
    state.valid = !failedValidations.length;
    state.failed = failedValidations;

    return emit(EmitEvents.UPDATED, state);
};

const show = (name: string): boolean => !!state.failed.length && (props.showAllValidations ? state.failed.includes(name) : state.failed[0] === name);
</script>
