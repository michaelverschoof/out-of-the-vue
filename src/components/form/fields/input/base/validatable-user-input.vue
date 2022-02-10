<template>
    <slot v-bind="$attrs" :validate="validate" :error="!state.valid" />

    <template v-for="validation of [...validations, ...customValidations]">
        <div v-if="showError(validation.name)">
            <slot :name="validation.name" />
        </div>
    </template>
</template>

<script lang="ts" setup>
import { EmitEvents } from '@/components/types';
import { ShowValidationErrors } from '@/composables/provide-inject-symbols';
import { BaseValidation, ValidationMethod, FieldData, ValidatedFieldData } from '@/composables/types';
import { useUserInputValidation } from '@/composables/validate-user-input';
import { inject, reactive, ref } from 'vue';

const emit = defineEmits<{
    (event: EmitEvents.UPDATED, data: ValidatedFieldData): void;
}>();

const props = defineProps({
    validations: {
        type: Array as () => BaseValidation[],
        required: false,
        default: null
    },
    customValidations: {
        type: Object as () => ValidationMethod[],
        required: false,
        default: null
    },
    showAllErrors: {
        type: Boolean,
        required: false,
        default: false
    }
});

const showValidationErrors = inject(ShowValidationErrors, ref(false));

const state: ValidatedFieldData = reactive({
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

    const failedValidations = validateInput(data, props.validations, props.customValidations);
    state.valid = !failedValidations.length;
    state.failed = failedValidations;
    console.log(state.failed);

    return emit(EmitEvents.UPDATED, state);
};

const showError = (name: string) => {
    return !state.valid && !!state.failed.length && !!showValidationErrors.value && (props.showAllErrors ? state.failed.includes(name) : state.failed[0] === name);
};
</script>
