<template>
    <slot name="opener" :open="openModal" />

    <teleport :to="parent ?? 'body'">
        <transition name="modal">

            <div v-if="showing" ref="element" class="backdrop" tabindex="-1" @click.self="closeModal" @keydown.esc="closeModal">
                <div v-bind="$attrs" class="modal">
                    <header v-if="$slots.header">
                        <slot name="header" :close="closeModal" />
                    </header>
                    <main>
                        <slot :close="closeModal" />
                    </main>
                    <footer v-if="$slots.footer">
                        <slot name="footer" :close="closeModal" />
                    </footer>
                </div>
            </div>

        </transition>
    </teleport>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

const emit = defineEmits<{ (event: 'opened' | 'closed'): void; }>();

const props = defineProps<{ parent?: string; open?: boolean; }>();

const element = ref<HTMLElement>(null);
const showing = ref<boolean>(false);

watch(() => props.open, (received: boolean) => {
    if (received === showing.value) {
        return;
    }

    received ? openModal() : closeModal();
});

const openModal = (): void => {
    showing.value = true;
    emit('opened');

    requestAnimationFrame(() => {
        element.value?.focus();
    });
};

const closeModal = (): void => {
    showing.value = false;
    emit('closed');
};

onMounted(() => {
    if (!props.open) {
        return;
    }

    openModal();
});

onUnmounted(() => {
    closeModal();
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
