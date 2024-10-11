<template>
    <slot name="activator" :open="openModal" />

    <teleport :to="parent ?? 'body'">
        <transition name="modal">
            <div
                v-if="open"
                ref="element"
                class="backdrop"
                tabindex="-1"
                @click.self="closeModal"
                @keydown.esc="closeModal"
            >
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
import { nextTick, ref, watch } from 'vue';

const emit = defineEmits<{ (event: 'opened' | 'closed'): void }>();

defineProps<{ parent?: string }>();

const open = defineModel<boolean>({ default: false });

const element = ref<HTMLDivElement>(null);

const openModal = (): void => {
    open.value = true;
};

const closeModal = (): void => {
    open.value = false;
};

watch(
    open,
    async (): Promise<void> => {
        if (!open.value) {
            emit('closed');
            return;
        }

        emit('opened');

        await nextTick();
        element.value.focus();
    },
    { immediate: true }
);

defineExpose({
    open: openModal,
    close: closeModal
});

defineOptions({
    inheritAttrs: false
});
</script>

<style lang="postcss" scoped>
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
