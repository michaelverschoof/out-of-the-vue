<template>
    <slot v-bind="$attrs" :debounce="debounce" />
</template>

<script lang="ts" setup>
import { OptionalProps } from '@/components/props.types';
import { useUserInputDebouncing } from '@/composables/debounce-user-input';
import { FieldData, ValidatedFieldData } from '@/composables/types';

const emit = defineEmits<{ (event: 'updated', data: FieldData | ValidatedFieldData): void; }>();

const props = defineProps({ delay: OptionalProps.number });

const { debounce: debounceInput } = useUserInputDebouncing();

const debounce = (data: FieldData | ValidatedFieldData): void => {
    if (!data.value) {
        return emit('updated', data);
    }

    debounceInput(() => { emit('updated', data); }, props.delay);
};
</script>
