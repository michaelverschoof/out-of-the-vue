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
import { nextTick, onMounted, ref } from 'vue';

const emit = defineEmits<{ (event: 'opened' | 'closed'): void }>();

const props = defineProps<{ parent?: string; open?: boolean }>();

const open = defineModel<boolean>();

const element = ref<HTMLDivElement>(null);

const openModal = async (): Promise<void> => {
    if (open.value === true) {
        return;
    }

    open.value = true;
    emit('opened');

    await nextTick();
    element.value?.focus();
};

const closeModal = (): void => {
    if (open.value === false) {
        return;
    }

    open.value = false;
    emit('closed');
};

onMounted(() => {
    if (props.open || open.value) {
        openModal();
    }
});

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
