<template>
    <slot name="opener" :open="open" />

    <teleport :to="parent">
        <transition name="modal">

            <div v-if="showing" ref="element" class="backdrop" tabindex="-1" @click.self="close" @keyup.esc="close">
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
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits<{ (event: ModalEmitType): void; }>();

const props = defineProps({
    parent: {
        type: String,
        required: false,
        default: 'body'
    },
    opened: OptionalProps.number
});

const element = ref<HTMLElement>(null);

const showing = ref(false);

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
    showing.value = !!props.opened || props.opened === 0;
});

onUnmounted(() => {
    showing.value = false;
});
</script>

<style lang="scss" scoped>
.backdrop {
    align-items: center;
    background-color: rgba(52, 58, 64, 0.8);
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
        background-color: darkgreen;
    }

    .modal {
        display: flex;
        flex-direction: column;
        transition: transform 500ms ease;
        color: black;
        max-width: 100vw;
        max-height: 100vh;
        overflow-y: hidden;
        flex-wrap: nowrap;

        header {
            flex-shrink: 0;
        }

        main {
            overflow-y: auto;
            flex-grow: 1;
        }

        footer {
            flex-shrink: 0;
        }
    }
}

.modal {
    &-enter-active,
    &-leave-active {
        transition: opacity 300ms ease;
    }

    &-leave-active {
        transition-delay: 300ms;
    }

    &-enter-from,
    &-leave-to {
        opacity: 0;

        .modal {
            transform: translateY(100%);
        }
    }
}
</style>
