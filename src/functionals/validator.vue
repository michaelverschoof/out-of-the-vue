<template>
    <slot v-bind="$attrs" :initialize="initialize" :validate="validate" :invalid="!state.valid" :showing="showing" :show-validity="showValidity" />

    <template v-if="!state.valid && showing">
        <template v-for="validation of validations">
            <strong v-if="provided($slots[validation.name]) && state.failed[0] === validation.name" class="validation-error" :class="validation.name">
                <slot :name="validation.name" />
            </strong>
        </template>
    </template>
</template>

<script lang="ts" setup>
import { FieldData, SubmittedSymbol, UpdateEmitType, ValidatedFieldData, ValidationMethod } from '@/composables/types';
import { useValidate } from '@/composables/validate';
import { provided } from '@/util/slots';
import { inject, reactive, ref, watch } from 'vue';

const emit = defineEmits<{ (event: 'created' | 'updated', data: ValidatedFieldData): void }>();

const props = defineProps<{ validations?: ValidationMethod[]; triggerValidation?: string; liveValidation?: boolean }>();

const state = reactive<ValidatedFieldData>({
    name: null,
    value: null,
    valid: !props.validations || !props.validations.length,
    failed: []
});

watch(
    () => props.validations,
    () => {
        revalidate();
    }
);

const triggeredSubmitValidation = inject(SubmittedSymbol, ref<boolean>(false));
const { validate: validateInput } = useValidate();
const showing = ref<boolean>(false);

watch(triggeredSubmitValidation, (received: boolean) => {
    if (!received && !props.triggerValidation) {
        showing.value = false;
        return;
    }

    revalidate();

    showing.value = true;
});

const triggeredValidation = ref<string | null>(null);

watch(
    () => props.triggerValidation,
    (received?: string) => {
        if (!received) {
            state.failed = state.failed.filter((item) => item !== triggeredValidation.value);
            state.valid = !state.failed.length;
            showing.value = !state.valid;
            return;
        }

        const validation = props.validations?.find((validation) => validation.name === received);
        if (!validation) {
            return;
        }

        triggeredValidation.value = received;

        state.valid = false;
        showing.value = true;
        if (!state.failed.includes(received)) {
            state.failed.push(received);
        }
    }
);

const initialize = (data: FieldData): void => {
    return validateFieldData(data, 'created');
};

const validate = (data: FieldData): void => {
    if (!!props.liveValidation) {
        showing.value = true;
    }

    return validateFieldData(data, 'updated');
};

// TODO: Move to composable for non-component use
const validateFieldData = (data: FieldData, event: UpdateEmitType): void => {
    if (state.name === data.name && JSON.stringify(state.value) === JSON.stringify(data.value)) {
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

function revalidate() {
    const failedValidations = validateInput(state, props.validations);
    if (props.triggerValidation) {
        failedValidations.push(props.triggerValidation);
    }

    state.valid = !failedValidations.length;
    state.failed = failedValidations;

    emit('updated', { ...state });
}
</script>
