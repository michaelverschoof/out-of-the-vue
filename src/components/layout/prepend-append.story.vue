<template>
    <Story title="Layout/Prepend append" :layout="{ type: 'grid', width: 400 }" auto-props-disabled>
        <Variant title="Prepend" icon="lucide:arrow-left">
            <prepend-append>
                <template #prepend><icon icon="mdi:airballoon" color="" /></template>
                Content as text
            </prepend-append>
        </Variant>

        <Variant title="Append" icon="lucide:arrow-right">
            <prepend-append>
                <template #append><icon icon="mdi:airplane" /></template>
                <span>Content in a span</span>
            </prepend-append>
        </Variant>

        <Variant title="Prepend and append" icon="lucide:arrow-left-right">
            <prepend-append>
                <template #prepend><icon icon="mdi:airballoon" /></template>
                <template #append><icon icon="mdi:airplane" /></template>
                <span>Content in a span</span>
            </prepend-append>
        </Variant>

        <Variant title="Nested prepend and append" icon="lucide:chevrons-right-left">
            <prepend-append>
                <template #prepend><icon icon="mdi:airballoon" /></template>
                <template #append><icon icon="mdi:airplane" /></template>
                <prepend-append>
                    <template #prepend><icon icon="mdi:sail-boat" /></template>
                    <template #append><icon icon="mdi:car-hatchback" /></template>
                    Content as text
                </prepend-append>
            </prepend-append>
        </Variant>

        <Variant title="Empty">
            <prepend-append>
                <span class="text">Content in a span</span>
            </prepend-append>
        </Variant>

        <template #controls>
            <show-grid-lines show />
        </template>
    </Story>
</template>

<script lang="ts" setup>
import PrependAppend from '@/components/layout/prepend-append.vue';
import { Icon } from '@iconify/vue';
import ShowGridLines from '@test/components/show-grid-lines.vue';
</script>

<docs lang="md">
# Numeric input

Base input for number fields.
Allows decimals and negative values by default, but these can be disabled.
</docs>
