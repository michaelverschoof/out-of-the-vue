<template>
    <component :is="tag" class="message">
        <slot />
    </component>
</template>

<script lang="ts" setup>
defineProps({
    tag: {
        type: String,
        required: false,
        default: 'span'
    }
});
</script>
