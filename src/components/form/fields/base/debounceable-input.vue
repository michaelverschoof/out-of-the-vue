<template>
    <slot v-bind="filter($attrs, ['delay'])" :debounce="debounce" />
</template>

<script lang="ts" setup>
import { OptionalProps } from '@/components/props.types';
import { useUserInputDebouncing } from '@/composables/debounce-user-input';
import { FieldData, UpdateEmitType, ValidatedFieldData } from '@/composables/types';
import { filter } from '@/util/attrs';

const emit = defineEmits<{ (event: UpdateEmitType, data: FieldData | ValidatedFieldData): void; }>();

const props = defineProps({ delay: OptionalProps.number });

const { debounce: debounceInput } = useUserInputDebouncing();

const debounce = (data: FieldData | ValidatedFieldData): void => {
    if (!data || !data.value || !props.delay) {
        return emit('updated', data);
    }

    debounceInput(() => {
        emit('updated', data);
    }, props.delay);
};
</script>
