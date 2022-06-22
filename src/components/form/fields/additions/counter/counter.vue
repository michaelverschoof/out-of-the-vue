<template>
    <component :is="tag ?? 'span'" class="counter" :class="{ exceeded: (count ?? 0) > limit }">
        {{ count ?? 0 }} / {{ limit }}
    </component>
</template>

<script lang="ts" setup>
const props = defineProps<{ limit: number; count?: number; tag?: string; }>();
</script>
