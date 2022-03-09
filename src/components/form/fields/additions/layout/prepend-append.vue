<template>
    <span v-if="providedSlot($slots.prepend) || providedSlot($slots.append)" class="prepend-append">

        <span v-if="providedSlot($slots.prepend)" class="prepend">
            <slot name="prepend" />
        </span>

        <span class="content">
            <slot />
        </span>

        <span v-if="providedSlot($slots.append)" class="append">
            <slot name="append" />
        </span>
    </span>

    <template v-else>
        <slot />
    </template>
</template>

<script lang="ts" setup>
import { providedSlot } from '@/util/slots';</script>

<style lang="scss" scoped>
.prepend-append {
    align-items: stretch;
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    height: 100%;

    .prepend, .append {
        display: flex;
        align-items: center;
    }
}
</style>
