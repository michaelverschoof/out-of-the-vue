<template>
    <slot v-bind="$attrs" :debounce="debounce" />
</template>

<script lang="ts" setup>
import { OptionalProps } from '@/components/props.types';
import { EmitEvents } from '@/components/types';
import { useUserInputDebouncing } from '@/composables/debounce-user-input';
import { FieldData, ValidatedFieldData } from '@/composables/types';

const emit = defineEmits<{
    (event: EmitEvents.UPDATED, data: FieldData | ValidatedFieldData): void;
}>();

const props = defineProps({ delay: OptionalProps.number });

const { debounce: debounceInput } = useUserInputDebouncing();

const debounce = (data: FieldData | ValidatedFieldData): void => {
    if (!data.value) {
        emit(EmitEvents.UPDATED, data);
        return;
    }

    debounceInput(() => {
        emit(EmitEvents.UPDATED, data);
    }, props.delay);
};
</script>
