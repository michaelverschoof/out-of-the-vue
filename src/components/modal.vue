<template>
    <slot name="opener" :open="open" />

    <teleport :to="parent">
        <transition name="modal">

            <div v-if="showing" ref="element" class="backdrop" tabindex="-1" @click.self="close" @keydown.esc="close">
                <div v-bind="$attrs" class="modal">
                    <header v-if="$slots.header">
                        <slot name="header" :close="close" />
                    </header>
                    <main>
                        <slot :close="close" />
                    </main>
                    <footer v-if="$slots.footer">
                        <slot name="footer" :close="close" />
                    </footer>
                </div>
            </div>

        </transition>
    </teleport>
</template>

<script lang="ts" setup>
import { OptionalProps } from '@/components/props.types';
import { ModalEmitType } from '@/composables/types';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const emit = defineEmits<{ (event: ModalEmitType): void; }>();

const props = defineProps({
    parent: {
        type: String,
        required: false,
        default: 'body'
    },
    opened: OptionalProps.boolean
});

const element = ref<HTMLElement>(null);

const showing = ref(false);

watch(() => props.opened, (received: boolean) => {
    if (received === showing.value) {
        return;
    }

    received ? open() : close();
});

const open = () => {
    showing.value = true;
    emit('opened');

    requestAnimationFrame(() => {
        element.value?.focus();
    });
};

const close = (): void => {
    showing.value = false;
    emit('closed');
};

onMounted(() => {
    if (!props.opened) {
        return;
    }

    open();
});

onUnmounted(() => {
    close();
});
</script>

<style lang="scss" scoped>
.backdrop {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    left: 0;
    overflow-y: hidden;
    position: absolute;
    top: 0;
    width: 100%;

    .modal {
        display: flex;
        flex-direction: column;
        max-width: 100vw;
        max-height: 100vh;
        overflow-y: hidden;
        flex-wrap: nowrap;

        header,
        footer {
            flex-shrink: 0;
        }

        main {
            overflow-y: auto;
            flex-grow: 1;
        }
    }
}
</style>
