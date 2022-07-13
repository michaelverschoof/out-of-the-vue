<template>
    <slot :debounce="debounce" />
</template>

<script lang="ts" setup>
import { useDebounce } from '@/composables/debounce';
import { FieldData, ValidatedFieldData } from '@/composables/types';

const emit = defineEmits<{ (event: 'created' | 'updated', data: FieldData | ValidatedFieldData): void; }>();

const props = defineProps<{ delay?: number; }>();

const { debounce: debounceInput } = useDebounce();

const debounce = (data: FieldData | ValidatedFieldData): void => {
    if (!data || props.delay === 0) {
        return emit('updated', data);
    }

    debounceInput(() => {
        emit('updated', data);
    }, props.delay);
};
</script>
