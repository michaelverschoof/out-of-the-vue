<template>
    <user-input
        :name="name"
        :value="value"
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
import { computed, reactive } from 'vue';

const emit = defineEmits([ EmitEvents.CREATED, EmitEvents.UPDATED ]);

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

// TODO: Improve
const regex = computed(() => {
    let reg = '0-9';
    if (props.allowDecimals) {
        reg += '.,';
    }
    if (props.allowNegative) {
        reg += '-';
    }
    return reg;
});

const state = reactive<NumberFieldData>({
    name: props.name,
    value: props.value ?? null
});

const parse = (data: StringFieldData): number => {
    if (!data.value || !data.value.trim()) {
        return null;
    }

    let filtered = '';

    if (props.allowDecimals) {
        // Replace all commas with dots and remove all but the last
        filtered = data.value.trim().replace(',', '.').replace(/[.](?=.*[.])/g, '');
    }

    if (props.allowNegative) {
        // Filter minus signs from the string except the first character (as it's allowed there)
        filtered = filtered[0] + filtered.slice(1).replace('-', '');
    }

    // Parse it to a number and return it with null as a fallback in case of NaN (which should not happen)
    return Number(filtered) || null;
};

const created = (data: StringFieldData): void => {
    state.value = parse(data);
    console.log(state.value);
    emit(EmitEvents.CREATED, state);
};

const updated = (data: StringFieldData): void => {
    state.value = parse(data);
    console.log(state.value);
    emit(EmitEvents.CREATED, state);
};
</script>

<style scoped>

</style>
