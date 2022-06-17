<template>
    <component :is="tag ?? 'span'" class="counter" :class="{ exceeded: count > limit }">
        {{ count ?? 0 }} / {{ limit }}
    </component>
</template>

<script lang="ts" setup>
const props = defineProps<{ limit: number; count?: number; tag?: string; }>();
</script>
