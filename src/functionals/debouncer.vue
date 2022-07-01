<template>
    <slot :debounce="debounce" />
</template>

<script lang="ts" setup>
import { useUserInputDebouncing } from '@/composables/debounce-user-input';
import { FieldData, ValidatedFieldData } from '@/composables/types';

const emit = defineEmits<{ (event: 'created' | 'updated', data: FieldData | ValidatedFieldData): void; }>();

const props = defineProps<{ delay?: number; }>();

const { debounce: debounceInput } = useUserInputDebouncing();

const debounce = (data: FieldData | ValidatedFieldData): void => {
    if (!data || !data.value || props.delay === 0) {
        return emit('updated', data);
    }

    debounceInput(() => {
        emit('updated', data);
    }, props.delay);
};
</script>
