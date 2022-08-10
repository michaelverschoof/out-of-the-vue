<template>
    <component :is="tag ?? 'span'" class="counter" :class="{ exceeded: limit && (count ?? 0) > limit }">
        <template v-if="!limit">{{ count ?? 0 }}</template>
        <template v-else>{{ count ?? 0 }} / {{ limit }}</template>
    </component>
</template>

<script lang="ts" setup>
const props = defineProps<{ count?: number; limit?: number; tag?: string; }>();
</script>
