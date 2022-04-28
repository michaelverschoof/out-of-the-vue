<template>
    <slot v-bind="$attrs" :initialize="initialize" :validate="validate" :invalid="!state.valid" :showing="showing" :show-validity="showValidity" />

    <template v-if="!state.valid && showing" v-for="validation of validations">
        <strong v-if="provided($slots[validation.name]) && state.failed[0] === validation.name" class="validation-error">
            <slot :name="validation.name" />
        </strong>
    </template>
</template>

<script lang="ts" setup>
import { OptionalProps } from '@/components/props.types';
import { FieldData, UpdateEmitType, ValidatedFieldData } from '@/composables/types';
import { useUserInputValidation } from '@/composables/validate-user-input';
import { provided } from '@/util/slots';
import { reactive, ref } from 'vue';

const emit = defineEmits<{ (event: UpdateEmitType, data: ValidatedFieldData): void; }>();

const props = defineProps({ validations: OptionalProps.validations });

const state = reactive<ValidatedFieldData>({
    name: null,
    value: null,
    valid: !props.validations || !props.validations.length,
    failed: []
});

const showing = ref(false);

const { validate: validateInput } = useUserInputValidation();

const initialize = (data: FieldData): void => {
    return validateFieldData(data, 'created');
};

const validate = (data: FieldData): void => {
    return validateFieldData(data, 'updated');
};

const validateFieldData = (data: FieldData, event: UpdateEmitType): void => {
    state.name = data.name;
    state.value = data.value;

    if (!props.validations || !props.validations.length) {
        state.valid = true;
        state.failed = [];
        showing.value = false;

        return emit(event, state);
    }

    const failedValidations = validateInput(data, props.validations);

    state.valid = !failedValidations.length;
    state.failed = failedValidations;

    return emit(event, state);
};

// TODO: Can we trigger this better?
const showValidity = () => {
    showing.value = !state.valid;
};
</script>
