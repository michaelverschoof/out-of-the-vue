<template>
    <user-input
        :name="name"
        :value="displayValue"
        :allowed-characters="regex"
        @focused="$emit(EmitEvents.FOCUSED)"
        @blurred="$emit(EmitEvents.BLURRED)"
        @updated="updated"
        @created="created"
    />
</template>

<script lang="ts" setup>
import UserInput from '@/components/form/fields/base/user-input.vue';
import { EmitEvents } from '@/components/types';
import { NumberFieldData, StringFieldData } from '@/composables/types';
import { computed, reactive, ref } from 'vue';

const emit = defineEmits<{
    (event: EmitEvents.BLURRED): void;
    (event: EmitEvents.FOCUSED): void;
    (event: EmitEvents.CREATED, data: NumberFieldData): void;
    (event: EmitEvents.UPDATED, data: NumberFieldData): void;
}>();

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: false,
        default: null
    },
    allowDecimals: {
        type: Boolean,
        required: false,
        default: true
    },
    allowNegative: {
        type: Boolean,
        required: false,
        default: true
    }
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
    emit(EmitEvents.CREATED, state);
};

const updated = (data: StringFieldData): void => {
    parse(data);
    emit(EmitEvents.UPDATED, state);
};
</script>
