<template>
    <counter :tag="tag" :limit="limit" :count="count" />
</template>

<script lang="ts" setup>
import Counter from '@/components/form/fields/additions/counter/counter.vue';
import { OptionalProps, RequiredProps } from '@/components/props.types';
import { computed } from 'vue';

const props = defineProps({
    limit: RequiredProps.number,
    value: OptionalProps.string,
    tag: {
        type: String,
        required: false,
        default: 'span'
    },
    type: {
        type: String as () => 'character' | 'word',
        required: false,
        default: 'character'
    }
});

const count = computed(() => props.value?.split(props.type === 'word' ? ' ' : '').length || 0);
</script>
