<template>

    <form @submit.prevent="submit" @created="created" @updated="updated">
        <slot />
    </form>

</template>

<script lang="ts" setup>
import { FieldData, SubmittedSymbol, ValidatedFieldData, ValidatedFormData } from '@/composables/types';
import { hasOwnProperty } from '@vue/test-utils/dist/utils';
import { onMounted, provide, reactive, Ref, ref } from 'vue';

const emit = defineEmits<{ (event: 'created' | 'updated' | 'submitted', data: ValidatedFormData): void; }>();

const props = defineProps<{ name: string; }>();

const state = reactive<ValidatedFormData>({
    fields: new Map(),
    name: props.name,
    valid: false
});

const created = (data: FieldData | ValidatedFieldData): void => {
    updateField(data);
};

const updated = (data: FieldData | ValidatedFieldData): void => {
    updateField(data);
    emit('updated', { ...state });
};

const showValidationState = ref<boolean>(false);
provide<Ref<boolean>>(SubmittedSymbol, showValidationState);

const submit = (): void => {
    if (hasInvalidFields()) {
        showValidationState.value = true;
        return;
    }

    emit('submitted', { ...state });
};

onMounted(() => {
    emit('created', { ...state });
});

function updateField(data: FieldData | ValidatedFieldData): void {
    state.fields.set(data.name, data);
    state.valid = !hasInvalidFields();
}

function hasInvalidFields(): boolean {
    return Object.values(state.fields)
    .filter((field: FieldData | ValidatedFieldData) => hasOwnProperty(field, 'valid'))
    .some((field: ValidatedFieldData) => field.valid === false);
}
</script>
