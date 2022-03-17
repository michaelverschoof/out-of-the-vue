<template>
    <user-input
        :allowed-characters="regex"
        :inputmode="allowDecimals ? 'decimal' : 'numeric'"
        :name="name"
        :pattern="regex"
        :value="displayValue"
        @updated="updated"
        @created="created"
    />
</template>

<script lang="ts" setup>
import UserInput from '@/components/form/fields/base/user-input.vue';
import { OptionalProps, RequiredProps } from '@/components/props.types';
import { NumberFieldData, StringFieldData } from '@/composables/types';
import { computed, reactive, ref } from 'vue';

const emit = defineEmits<{
    (event: 'created', data: NumberFieldData): void;
    (event: 'updated', data: NumberFieldData): void;
}>();

const props = defineProps({
    name: RequiredProps.string,
    value: OptionalProps.number,
    allowDecimals: OptionalProps.booleanTrue,
    allowNegative: OptionalProps.booleanTrue
});

const regex = computed(() => {
    let reg = '0-9';

    if (props.allowDecimals) {
        reg += '.,';
    }
    if (props.allowNegative) {
        reg += '-';
    }

    return `[${ reg }]`;
});

const displayValue = ref<string>(props.value?.toString() ?? null); // TODO add decimal separator and use that

const state = reactive<NumberFieldData>({
    name: props.name,
    value: props.value ?? null
});

const parse = (data: StringFieldData): number => {
    let filtered = data.value?.trim();
    if (!filtered) {
        return null;
    }

    if (props.allowDecimals) {
        // Filter all decimal signs except the last
        filtered = data.value.replace(/[.,](?=.*[.,])/g, '');
    }

    if (props.allowNegative) {
        // Filter minus signs from the string except the first character (as it's allowed there)
        filtered = filtered[0] + filtered.slice(1).replace('-', '');
    }

    // Set the filtered value for the text input field
    displayValue.value = filtered;

    // Parse it to a number and return it with null as a fallback in case of NaN (which should not happen)
    state.value = Number(filtered.replace(',', '.')) || null;
};

const created = (data: StringFieldData): void => {
    parse(data);
    emit('created', state);
};

const updated = (data: StringFieldData): void => {
    parse(data);
    emit('updated', state);
};
</script>
