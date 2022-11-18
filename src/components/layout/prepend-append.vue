<template>
    <span v-if="providedPrepend || providedAppend" class="prepend-append">
        <span v-if="providedPrepend" class="prepend">
            <slot name="prepend" />
        </span>

        <span class="content">
            <slot />
        </span>

        <span v-if="providedAppend" class="append">
            <slot name="append" />
        </span>
    </span>

    <template v-else>
        <slot />
    </template>
</template>

<script lang="ts" setup>
import { provided } from '@/util/slots';
import { computed, useSlots } from 'vue';

const slots = useSlots();
const providedPrepend = computed(() => provided(slots.prepend));
const providedAppend = computed(() => provided(slots.append));
</script>

<style scoped>
.prepend-append {
    align-items: stretch;
    display: grid;
    grid-template-areas: 'prepend content append';
    grid-template-columns: max-content 1fr max-content;
    height: 100%;
    width: 100%;

    .prepend,
    .content,
    .append {
        display: flex;
        align-items: center;
    }

    .prepend {
        grid-area: prepend;
    }

    .append {
        grid-area: append;
    }

    .content {
        grid-area: content;
    }
}
</style>
