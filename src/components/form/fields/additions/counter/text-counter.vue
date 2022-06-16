<template>
    <counter :tag="tag" :limit="limit" :count="count" />
</template>

<script lang="ts" setup>
import Counter from '@/components/form/fields/additions/counter/counter.vue';
import { computed } from 'vue';

const props = defineProps<{ limit: number; value?: string; tag?: string; type?: 'character' | 'word'; }>();

const count = computed(() => props.value?.split(props.type === 'word' ? ' ' : '').length || 0);
</script>
