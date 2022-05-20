<template>
    <text-input
        :allowed-characters="regex"
        :inputmode="allowDecimals ? 'decimal' : 'numeric'"
        :name="name"
        :pattern="regex"
        :value="model"
        @updated="updated"
        @created="created"
    />
</template>

<script lang="ts" setup>
import TextInput from '@/components/form/fields/base/text-input.vue';
import { OptionalProps, RequiredProps } from '@/components/props.types';
import { NumberFieldData, StringFieldData, UpdateEmitType } from '@/composables/types';
import { filter, parse } from '@/util/numbers';
import { computed, reactive, ref, watch } from 'vue';

const emit = defineEmits<{ (event: UpdateEmitType, data: NumberFieldData): void; }>();

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

const model = ref<string>(props.value?.toString() ?? null); // TODO add decimal separator and use that

const state = reactive<NumberFieldData>({
    name: props.name,
    value: props.value ?? null
});

watch(() => props.value, (received: number): void => {
    if (received === state.value) {
        return;
    }

    state.value = received;
    model.value = state.value?.toString();
});

const parseNumber = (data: StringFieldData): number => {
    const filtered = filter(data.value, props.allowDecimals, props.allowNegative);
    if (!filtered) {
        state.value = null;
        return null;
    }

    // Set the filtered value for the text input field
    model.value = filtered;
    state.value = parse(filtered);
};

const created = (data: StringFieldData): void => {
    parseNumber(data);
    emit('created', { ...state });
};

const updated = (data: StringFieldData): void => {
    parseNumber(data);
    emit('updated', { ...state });
};
</script>
