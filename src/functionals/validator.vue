<template>
    <slot v-bind="$attrs" :initialize="initialize" :validate="validate" :invalid="!state.valid" :showing="showing" :show-validity="showValidity" />

    <template v-if="!state.valid && showing">
        <template v-for="validation of validations">
            <strong
                v-if="provided($slots[validation.name]) && state.failed[0] === validation.name"
                class="validation-error"
                :class="validation.name"
                @click="emit('clicked-validation')"
            >
                <slot :name="validation.name" />
            </strong>
        </template>
    </template>
</template>

<script lang="ts" setup>
import { FieldData, SubmittedSymbol, UpdateEmitType, ValidatedFieldData, ValidationMethod } from '@/composables/types';
import { useValidate } from '@/composables/validate';
import { rawClone } from '@/util/copy';
import { provided } from '@/util/slots';
import { inject, reactive, ref, watch } from 'vue';

const emit = defineEmits<{
    (event: 'created' | 'updated', data: ValidatedFieldData): void;
    (event: 'clicked-validation'): void;
}>();

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
    validateFieldData(data, 'created');
};

const validate = (data: FieldData): void => {
    if (!!props.liveValidation) {
        showing.value = true;
    }

    validateFieldData(data, 'updated');
};

// TODO: Move to composable for non-component use
const validateFieldData = (data: FieldData, event: UpdateEmitType): void => {
    const clone = rawClone(data);

    state.name = clone.name;
    state.value = clone.value;

    if (!props.validations || !props.validations.length) {
        state.valid = true;
        state.failed = [];
        showing.value = false;

        return emit(event, rawClone(state));
    }

    const failedValidations = validateInput(clone, props.validations);

    state.valid = !failedValidations.length;
    state.failed = failedValidations;

    return emit(event, rawClone(state));
};

// TODO: Can we trigger this better?
const showValidity = (): void => {
    showing.value = !state.valid;
};

function revalidate(): void {
    const failedValidations = validateInput(state, props.validations);
    if (props.triggerValidation) {
        failedValidations.push(props.triggerValidation);
    }

    state.valid = !failedValidations.length;
    state.failed = failedValidations;

    emit('updated', rawClone(state));
}
</script>
