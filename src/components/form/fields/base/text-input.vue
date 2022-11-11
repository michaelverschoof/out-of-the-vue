<template>
    <component
        :is="!!textarea ? 'textarea' : 'input'"
        :id="name"
        ref="element"
        class="text-input"
        :class="{ focused }"
        :maxLength="max"
        :name="name"
        :value="model"
        @blur="blurElement"
        @focus="focusElement"
        @input="filterInputData"
        @keypress="preventUnallowedCharacters"
        @paste.prevent="filterPasteData"
    />
</template>

<script lang="ts" setup>
import { StringFieldData } from '@/composables/types';
import { filter, shorten, transform } from '@/util/strings';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const emit = defineEmits<{
    (event: 'focused' | 'blurred'): void;
    (event: 'created' | 'updated', data: StringFieldData): void;
}>();

const props = defineProps<{
    name: string;
    value?: string;
    textarea?: boolean;
    focus?: boolean;
    max?: number;
    allowedCharacters?: 'letters' | 'numbers' | string;
    transformInput?: 'uppercase' | 'lowercase';
}>();

const element = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
const focused = ref<boolean>(false);
const characterRegex = ref<RegExp>(getRegex(props.allowedCharacters));

const state = reactive<StringFieldData>({
    name: props.name,
    value: !!props.value ? (!!props.max ? props.value.slice(0, props.max) : props.value) : null
});

const model = computed({
    get: () => state.value,
    set: (value: string | null) => {
        if (value === state.value) {
            return;
        }

        state.value = value ?? null;
        emit('updated', { ...state });
    }
});

watch(
    () => props.value,
    (received?: string) => {
        const value = filterAndTransform(received);
        if (received === model.value || value === model.value) {
            return;
        }

        model.value = value;
    }
);

watch([() => props.allowedCharacters, () => props.transformInput], () => {
    characterRegex.value = getRegex(props.allowedCharacters);

    const value = filterAndTransform(model.value);
    if (value === model.value) {
        return;
    }

    model.value = value;
});

watch(
    () => props.focus,
    (received?: boolean) => {
        if (focused.value === received) {
            return;
        }

        !received ? element.value?.blur() : element.value?.focus();
    }
);

/**
 * Filter the pasted value by the allowed character format
 */
const filterPasteData = (event: ClipboardEvent): void => {
    model.value = filterAndTransform(event.clipboardData?.getData('text'));
};

/**
 * Prevent any unallowed characters
 */
const preventUnallowedCharacters = (event: KeyboardEvent): void => {
    if (characterRegex.value && !characterRegex.value.test(event.key)) {
        event.preventDefault();
    }
};

/**
 * Filter the user's inputted value by the allowed character format
 */
const filterInputData = (event: Event): void => {
    model.value = filterAndTransform((<HTMLInputElement>event.target).value);
};

/**
 * Filter and transform the provided value
 */
function filterAndTransform(value?: string): string {
    let filtered = filter(value?.trimStart() ?? '', characterRegex.value);
    if (!filtered) {
        return filtered;
    }

    filtered = shorten(filtered, props.max);
    if (!props.transformInput) {
        return filtered;
    }

    return transform(filtered, props.transformInput);
}

function getRegex(value?: 'letters' | 'numbers' | string): RegExp {
    if (!value) {
        return null;
    }

    const presets: Record<string, string> = { letters: '[A-Za-z]', numbers: '[0-9]' };

    return new RegExp(Object.keys(presets).includes(value) ? presets[value] : value, 'g');
}

const focusElement = (): void => {
    focused.value = true;
    emit('focused');
};

const blurElement = (): void => {
    focused.value = false;
    emit('blurred');
};

onMounted(() => {
    if (props.focus && element.value) {
        element.value.focus();
    }

    if (!!props.value && (props.allowedCharacters || props.transformInput)) {
        filterAndTransform(model.value);
    }

    emit('created', { ...state });
});
</script>

<style lang="scss" scoped>
.text-input {
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
