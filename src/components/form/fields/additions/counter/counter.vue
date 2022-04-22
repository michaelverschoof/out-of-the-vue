<template>
    <component :is="tag" class="counter" :class="{ exceeded: count > limit }">
        {{ count ?? 0 }} / {{ limit }}
    </component>
</template>

<script lang="ts" setup>
import { OptionalProps, RequiredProps } from '@/components/props.types';

defineProps({
    limit: RequiredProps.number,
    count: OptionalProps.number,
    tag: {
        type: String,
        required: false,
        default: 'span'
    }
});
</script>

<style lang="scss" scoped>
.counter {
    transition: color 200ms ease;

    &.exceeded {
        color: #ff0000;
    }
}
</style>
