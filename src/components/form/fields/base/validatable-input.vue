<template>
    <slot v-bind="$attrs" :initialize="initialize" :validate="validate" :invalid="!state.valid" :showing="showing" :show-validity="showValidity" />

    <template v-if="!state.valid && showing">
        <template v-for="validation of validations">
            <strong v-if="provided($slots[validation.name]) && state.failed[0] === validation.name" class="validation-error">
                <slot :name="validation.name" />
            </strong>
        </template>
    </template>
</template>

<script lang="ts" setup>
import { FieldData, SubmittedSymbol, UpdateEmitType, ValidatedFieldData, ValidationMethod } from '@/composables/types';
import { useUserInputValidation } from '@/composables/validate-user-input';
import { provided } from '@/util/slots';
import { inject, reactive, ref, watch } from 'vue';

const emit = defineEmits<{ (event: 'created' | 'updated', data: ValidatedFieldData): void; }>();

const props = defineProps<{ validations?: ValidationMethod[]; triggerValidation?: string; }>();

const state = reactive<ValidatedFieldData>({
    name: null,
    value: null,
    valid: !props.validations || !props.validations.length,
    failed: []
});

const triggeredSubmitValidation = inject(SubmittedSymbol, ref<boolean>(false));

const { validate: validateInput } = useUserInputValidation();

watch(triggeredSubmitValidation, (received: boolean) => {
    if (!received && !props.triggerValidation) {
        showing.value = false;
        return;
    }

    const failedValidations = validateInput(state, props.validations);
    if (props.triggerValidation) {
        failedValidations.push(props.triggerValidation);
    }

    state.valid = !failedValidations.length;
    state.failed = failedValidations;

    showing.value = true;
});

const triggeredValidation = ref<string | null>(null);

watch(() => props.triggerValidation, (received?: string) => {
    if (!received) {
        state.failed = state.failed.filter(item => item !== triggeredValidation.value);
        state.valid = !!state.failed.length;
        showing.value = !state.valid;
        return;
    }

    const validation = props.validations?.find(validation => validation.name === received);
    if (!validation) {
        return;
    }

    triggeredValidation.value = received;

    state.valid = false;
    showing.value = true;
    if (!state.failed.includes(received)) {
        state.failed.push(received);
    }
});

const showing = ref<boolean>(false);

const initialize = (data: FieldData): void => {
    return validateFieldData(data, 'created');
};

const validate = (data: FieldData): void => {
    return validateFieldData(data, 'updated');
};

// TODO: Move to composable for non-component use
const validateFieldData = (data: FieldData, event: UpdateEmitType): void => {
    if (state.value === data.value && state.name === data.name) {
        return;
    }

    state.name = data.name;
    state.value = data.value;

    if (!props.validations || !props.validations.length) {
        state.valid = true;
        state.failed = [];
        showing.value = false;

        return emit(event, { ...state });
    }

    const failedValidations = validateInput(data, props.validations);

    state.valid = !failedValidations.length;
    state.failed = failedValidations;

    return emit(event, { ...state });
};

// TODO: Can we trigger this better?
const showValidity = () => {
    showing.value = !state.valid;
};
</script>
