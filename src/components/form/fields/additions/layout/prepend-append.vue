<template>
    <span v-if="provided($slots.prepend) || provided($slots.append)" class="prepend-append">

        <span v-if="provided($slots.prepend)" class="prepend">
            <slot name="prepend" />
        </span>

        <span class="content">
            <slot />
        </span>

        <span v-if="provided($slots.append)" class="append">
            <slot name="append" />
        </span>
    </span>

    <template v-else>
        <slot />
    </template>
</template>

<script lang="ts" setup>
import { provided } from '@/util/slots';
//
</script>

<style lang="scss" scoped>
.prepend-append {
    align-items: stretch;
    display: grid;
    grid-template-areas: "prepend content append";
    grid-template-columns: max-content 1fr max-content;
    height: 100%;
    width: 100%;

    .prepend, .append {
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
