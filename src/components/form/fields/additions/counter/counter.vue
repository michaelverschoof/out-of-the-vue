<template>
    <component :is="tag" class="counter" :class="{ exceeded: count > limit }">
        {{ count }} / {{ limit }}
    </component>
</template>

<script lang="ts" setup>
defineProps({
    limit: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        required: false,
        default: null
    },
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
