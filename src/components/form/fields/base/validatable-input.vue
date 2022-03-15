<template>
    <slot v-bind="$attrs" :validate="validate" :invalid="!state.valid" :showing="showingValidity" :show-validity="showValidity" />

    <template v-if="!state.valid && showingValidity" v-for="validation of validations">
        <strong v-if="show(validation.name)" class="validation-error">
            <slot :name="validation.name" />
        </strong>
    </template>
</template>

<script lang="ts" setup>
import { OptionalProps } from '@/components/props.types';
import { EmitEvents } from '@/components/types';
import { FieldData, ValidatedFieldData } from '@/composables/types';
import { useUserInputValidation } from '@/composables/validate-user-input';
import { reactive, ref } from 'vue';

const emit = defineEmits<{ (event: EmitEvents.UPDATED, data: ValidatedFieldData): void; }>();

const props = defineProps({
    validations: OptionalProps.validations,
    showAllValidations: OptionalProps.booleanFalse
});

const state = reactive<ValidatedFieldData>({
    name: null,
    value: null,
    valid: false,
    failed: []
});

const showingValidity = ref(false);

const { validate: validateInput } = useUserInputValidation();

const validate = (data: FieldData): void => {
    state.name = data.name;
    state.value = data.value;

    if (!props.validations || !props.validations.length) {
        state.valid = true;
        state.failed = null;
        showingValidity.value = false;
        return emit(EmitEvents.UPDATED, state);
    }

    const failedValidations = validateInput(data, props.validations);
    state.valid = !failedValidations.length;
    state.failed = failedValidations;

    return emit(EmitEvents.UPDATED, state);
};

// TODO: Can we trigger this better?
const showValidity = () => {
    showingValidity.value = !state.valid;
};

const show = (name: string): boolean => !!state.failed.length && (props.showAllValidations ? state.failed.includes(name) : state.failed[0] === name);
</script>
