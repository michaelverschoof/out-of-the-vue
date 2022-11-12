<template>
    <story title="Components/Layout/Prepend append" :layout="{ type: 'grid', width: 400 }" auto-props-disabled>
        <variant title="Prepend" icon="lucide:arrow-left">
            <prepend-append :class="{ 'show-grid': showGrid }">
                <template #prepend><icon icon="mdi:airballoon" color="" /></template>
                <span style="padding-inline: 0.5rem">Content</span>
            </prepend-append>
        </variant>

        <variant title="Append" icon="lucide:arrow-right">
            <prepend-append :class="{ 'show-grid': showGrid }">
                <template #append><icon icon="mdi:airplane" /></template>
                <span style="padding-inline: 0.5rem">Content</span>
            </prepend-append>
        </variant>

        <variant title="Prepend and append" icon="lucide:arrow-left-right">
            <prepend-append :class="{ 'show-grid': showGrid }">
                <template #prepend><icon icon="mdi:airballoon" /></template>
                <template #append><icon icon="mdi:airplane" /></template>
                <span style="padding-inline: 0.5rem">Content</span>
            </prepend-append>
        </variant>

        <variant title="Nested prepend and append" icon="lucide:chevrons-right-left">
            <prepend-append :class="{ 'show-grid': showGrid }">
                <template #prepend><icon icon="mdi:airballoon" /></template>
                <template #append><icon icon="mdi:airplane" /></template>
                <prepend-append style="padding-inline: 0.5rem">
                    <template #prepend><icon icon="mdi:sail-boat" /></template>
                    <template #append><icon icon="mdi:car-hatchback" /></template>
                    <span style="padding-inline: 0.5rem">Content</span>
                </prepend-append>
            </prepend-append>
        </variant>

        <template #controls>
            <hst-checkbox v-model="showGrid" title="Show grid lines" />
        </template>
    </story>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import PrependAppend from './prepend-append.vue';
import { Icon } from '@iconify/vue';

const showGrid = ref<boolean>(false);
</script>

<docs lang="md">
# Numeric input

Base input for number fields.
Allows decimals and negative values by default, but these can be disabled.
</docs>

<style lang="scss" scoped>
svg {
    color: #aa23bb;
    height: 1.5rem;
    width: 1.5rem;
}
</style>
