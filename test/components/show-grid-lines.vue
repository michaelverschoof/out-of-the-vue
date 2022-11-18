<template>
    <div class="container">
        <h3>Global settings</h3>
        <label
            class="histoire-wrapper htw-p-2 hover:htw-bg-primary-100 dark:hover:htw-bg-primary-800 htw-flex htw-gap-2 htw-flex-wrap histoire-checkbox htw-cursor-pointer htw-items-center"
            role="checkbox"
            tabindex="0"
        >
            <span class="htw-w-28 htw-whitespace-nowrap htw-text-ellipsis htw-overflow-hidden htw-shrink-0"> Show grid lines </span>

            <span class="htw-grow htw-max-w-full htw-flex htw-items-center htw-gap-1">
                <span class="htw-block htw-grow htw-max-w-full">
                    <input type="checkbox" v-model="active" />
                </span>
            </span>
        </label>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{ show?: boolean }>();

const active = ref<boolean>(!!props.show);

watch(
    () => active.value,
    () => {
        if (!active.value) {
            document.body.classList.remove('show-grid-lines');
            return;
        }

        document.body.classList.add('show-grid-lines');
    },
    { immediate: true }
);
</script>

<style scoped>
.container {
    @apply border-b;
    @apply border-gray-600;
    @apply mb-4;
}
</style>
