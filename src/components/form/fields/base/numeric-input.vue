<template>
    <text-input
        v-bind="exclude($attrs, ['class', 'onCreated', 'onUpdated'])"
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
import { NumberFieldData, StringFieldData } from '@/composables/types';
import { exclude } from '@/util/attrs';
import { filter, parse } from '@/util/numbers';
import { computed, reactive, ref, watch } from 'vue';

const emit = defineEmits<{ (event: 'created' | 'updated', data: NumberFieldData): void; }>();

const props = withDefaults(
    defineProps<{ name: string; value?: number; allowDecimals?: boolean; allowNegative?: boolean; }>(),
    { allowDecimals: true, allowNegative: true }
);

const regex = computed(() => `[0-9${ props.allowDecimals ? '.,' : '' }${ props.allowNegative ? '-' : '' }]`);

const model = ref<string>(props.value?.toString() ?? null);

const state = reactive<NumberFieldData>({
    name: props.name,
    value: props.value ?? null
});

watch(() => props.value, (received: number) => {
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

<script lang="ts">
export default {
    inheritAttrs: false
};
</script>
