<template>
    <story title="Counter/Text counter" :layout="{ type: 'grid', width: 400 }">
        <variant title="Character count">
            <text-counter :value="state.value" :limit="state.characterLimit" type="character" />
        </variant>

        <variant title="Word count">
            <text-counter :value="state.value" :limit="state.wordLimit" type="word" />
        </variant>

        <template #controls>
            <hst-text v-model="state.value" title="Value" />
            <hst-checkbox v-model="state.exceeded" title="Exceed limit" />
        </template>
    </story>
</template>

<script lang="ts" setup>
import TextCounter from '@/components/counter/text-counter.vue';
import { reactive, watch } from 'vue';

const state = reactive({
    value: 'some value',
    characterLimit: 15,
    wordLimit: 3,
    exceeded: false
});

watch(
    () => state.exceeded,
    (received: boolean) => {
        if (!received) {
            state.characterLimit = 15;
            state.wordLimit = 3;
            return;
        }

        state.characterLimit = state.value.length - 1;
        state.wordLimit = state.value?.split(' ').filter((item) => !!item.length).length - 1;
    }
);
</script>

<docs lang="md">
# Text counter

Built for adding a text counter to input fields, but usable in other places as well.
This counter can be set to count characters or words (separated by space).

When the limit is exceeded, an `exceeded`-class is added to the element.
</docs>
