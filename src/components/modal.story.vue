<template>
    <Story title="Modal" :layout="{ type: 'grid', width: 400 }">
        <Variant title="Simple">
            <modal parent=".histoire-story-viewer" :open="state.open" @opened="open" @closed="close">
                <template #opener="{ open }">
                    <hst-button color="primary" class="p-2" @click="open"> Open modal </hst-button>
                </template>

                <template #header="{ close }">
                    <div class="flex">
                        <strong class="grow">Header</strong>
                        <hst-button color="primary" class="px-2" @click="close"> Close modal </hst-button>
                    </div>
                </template>

                <template #default="{ close }">
                    This is a simple modal. You can close this modal by using the buttons in the header, the footer or this body. Both the "ESC" button and
                    clicking the backdrop will close the modal as well.<br /><br />
                    <hst-button color="primary" class="px-2" @click="close"> Close modal </hst-button>
                </template>

                <template #footer="{ close }">
                    <div class="flex">
                        <strong class="grow">Footer</strong>
                        <hst-button color="primary" class="px-2" @click="close"> Close modal </hst-button>
                    </div>
                </template>
            </modal>
            <br />
            <pre>
// Use the below styling for the fade-in effect
.modal {
    &-enter-active,
    &-leave-active {
        transition-property: opacity;
        transition-duration: 300ms;
        transition-timing-function: ease;
    }

    &-enter-from,
    &-leave-to {
        opacity: 0;
    }
}
            </pre>
        </Variant>

        <template #controls>
            <hst-checkbox v-model="state.open" title="Open" />
            <hst-checkbox v-model="state.animation" title="Add transition styling" />
        </template>
    </Story>
</template>

<script lang="ts" setup>
import { logEvent } from 'histoire/client';
import { reactive } from 'vue';
import Modal from './modal.vue';

const state = reactive({
    open: false,
    animation: false
});

const open = (event: any) => {
    state.open = true;
    logEvent('opened', event);
};

const close = (event: any) => {
    state.open = false;
    logEvent('closed', event);
};
</script>

<style lang="postcss">
.histoire-story-viewer {
    .backdrop {
        background-color: rgba(154, 162, 199, 0.5);

        .modal {
            @apply bg-cyan-100;
            @apply p-4;
            transition-property: transform;
            transition-duration: 300ms;
            display: grid;
            grid-template-rows: min-content 1fr min-content;
            gap: 0.5rem;
            width: 20rem;
            height: 20rem;
            color: black;
        }
    }

    .modal {
        &-enter-active,
        &-leave-active {
            transition-property: opacity;
            transition-duration: 300ms;
            transition-timing-function: ease;
        }

        &-enter-from,
        &-leave-to {
            opacity: 0;
        }
    }
}
</style>

<docs lang="md">
# Text field

The text field provides a structured way of building form fields.

This field allows for debouncing input and custom validations with pre-built validations enabled by default.
It also contains the structure to add a label above the input, hint information below the input, error messages and prepended/appended icons.

All of these can be any text or HTML that you want so you can build the field how you want it.
</docs>
