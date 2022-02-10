<template>
    <component :is="tag" class="counter" :class="{ exceeded: count > limit }">
        {{ count }} / {{ limit }}
    </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
    tag: {
        type: String,
        required: false,
        default: 'span'
    },
    type: {
        type: String as () => 'character' | 'word',
        required: false,
        default: 'character'
    },
    limit: {
        type: Number,
        required: true
    },
    current: {
        type: String,
        required: false,
        default: ''
    }
});

const count = computed(() => props.current?.split(props.type === 'word' ? ' ' : '').length || 0);
</script>

<style lang="scss" scoped>
.counter {
    transition: color 200ms ease;

    &.exceeded {
        color: #ff0000;
    }
}
</style>
