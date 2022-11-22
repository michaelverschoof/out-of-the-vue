<template>
    <story title="Components/Counter/Counter" :layout="{ type: 'grid', width: 400 }">
        <counter :count="state.value.length" :limit="state.limit" />

        <template #controls>
            <hst-text v-model="state.value" title="Value" />
            <hst-checkbox v-model="state.exceeded" title="Exceed limit" />
        </template>
    </story>
</template>

<script lang="ts" setup>
import Counter from '@/components/counter/counter.vue';
import { reactive, watch } from 'vue';

const state = reactive({
    value: 'some value',
    limit: 15,
    exceeded: false
});

watch(
    () => state.exceeded,
    (received: boolean) => {
        if (!received) {
            state.limit = 15;
            return;
        }

        state.limit = state.value.length - 1;
    }
);
</script>

<docs lang="md">
# Counter

Built for adding a counter to input fields, but usable in other places as well.

When the limit is exceeded, an `exceeded`-class is added to the element.
</docs>
