<template>
    <text-input
        v-bind="exclude($attrs, ['class', 'onCreated', 'onUpdated'])"
        :allowed-characters="regex"
        :inputmode="allowDecimals ? 'decimal' : 'numeric'"
        :name="name"
        :value="model"
        @updated="updated"
        @created="created"
    />
</template>

<script lang="ts" setup>
import TextInput from '@/components/form/fields/base/text-input.vue';
import { NumberFieldData, StringFieldData } from '@/composables/types';
import { exclude } from '@/util/attrs';
import { rawClone } from '@/util/copy';
import { parse } from '@/util/numbers';
import { computed, reactive, watch } from 'vue';

const emit = defineEmits<{ (event: 'created' | 'updated', data: NumberFieldData): void }>();

const props = withDefaults(defineProps<{ name: string; value?: number; allowDecimals?: boolean; allowNegative?: boolean }>(), {
    allowDecimals: true,
    allowNegative: true
});

const regex = computed<string>(() => `[0-9${props.allowDecimals ? '.,' : ''}${props.allowNegative ? '-' : ''}]`);

const model = computed<string>(() => state.value?.toString() ?? null);

const state = reactive<NumberFieldData>({
    name: props.name,
    value: props.value ?? null
});

watch(
    () => props.value,
    (received: number) => {
        if (received === state.value) {
            return;
        }

        state.value = received ?? null;
    }
);

const parseNumber = (data: StringFieldData): number => {
    return parse(data.value ?? '', props.allowDecimals, props.allowNegative);
};

const created = (data: StringFieldData): void => {
    state.value = parseNumber(data);
    emit('created', rawClone(state));
};

const updated = (data: StringFieldData): void => {
    state.value = parseNumber(data);
    emit('updated', rawClone(state));
};
</script>

<script lang="ts">
export default {
    inheritAttrs: false
};
</script>
