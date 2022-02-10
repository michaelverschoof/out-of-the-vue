<template>
    <label class="prepend-append" :class="{ focused }">
        <span v-if="$slots.prepend" class="prepend">
            <slot name="prepend" />
        </span>

        <span class="content">
            <slot :focus="focus" :blur="blur" />
        </span>

        <span v-if="$slots.append" class="append">
            <slot name="append" />
        </span>
    </label>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const focused = ref(false);

const focus = () => {
    focused.value = true;
};

const blur = () => {
    focused.value = false;
};
</script>

<style lang="scss" scoped>
.prepend-append {
    border: 1px solid #35495e;
    border-radius: .25em;
    display: flex;
    transition: border-color, box-shadow;
    transition-duration: 200ms;
    transition-timing-function: ease;

    &.focused {
        border-color: #41b883;
        box-shadow: 0 0 .25em .125em rgba(65, 184, 131, 0.25);
    }

    &.error:not(.focused) {
        border-color: red;
        box-shadow: 0 0 .25em .125em rgba(255, 0, 0, 0.25);
    }

    .prepend, .append {
        display: flex;
        align-items: center;
        flex-grow: 0;
        flex-shrink: 0;
    }

    .content {
        flex-grow: 1;
        padding-left: 0.5em;
        padding-right: 0.5em;
    }
}
</style>
