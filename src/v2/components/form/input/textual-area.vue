<template>
    <textarea
        ref="element"
        v-model="model"
        :name="name"
        :class="{ focused }"
        class="textual-area"
        @focus="onFocus"
        @blur="onBlur"
    />
</template>

<script setup lang="ts">
import { InputEmits, TextualInputProps } from '@/v2/components/form/input/types';
import { createFilters, createModifiers, transform } from '@/v2/functions/model';
import { useDebounceFn } from '@vueuse/core';
import { ref } from 'vue';

const props = defineProps<TextualInputProps>();

const emit = defineEmits<InputEmits>();

const [model, modifiers] = defineModel<string>({
    set: (value: string): string => {
        const presets = Object.keys(modifiers);
        if (!presets.length && !props.modifiers && !props.filters) {
            return value;
        }

        const filters = createFilters(props.filters);
        if (!presets.length && !props.modifiers) {
            return transform(value, ...filters);
        }

        const modelModifiers = createModifiers(presets);
        if (!props.modifiers) {
            return transform(value, ...filters, ...modelModifiers);
        }

        const propModifiers = createModifiers(props.modifiers);
        return transform(value, ...filters, ...modelModifiers, ...propModifiers);
    }
});

const element = ref<HTMLTextAreaElement>();

const focused = ref<boolean>();

const onFocus = (event: FocusEvent): void => {
    focused.value = true;
    emit('focus', event);
};

const onBlur = useDebounceFn((event: FocusEvent): void => {
    if (document.activeElement === element.value) {
        return;
    }

    focused.value = false;
    emit('blur', event);
}, 100);

defineExpose({
    focus: () => element.value.focus(),
    blur: () => element.value.blur()
});
</script>

<style lang="postcss" scoped>
.textual-area {
    border: none;
    color: inherit;
    font-family: inherit;
    font-size: 1em;
    height: 100%;
    outline: none;
    padding-left: 0.5em;
    padding-right: 0.5em;
    width: 100%;
}
</style>
