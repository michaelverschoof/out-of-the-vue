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

const model = computed<string>(() => state.value);

const state = reactive<StringFieldData>({
    name: props.name,
    value: props.value ?? null
});

function update(value?: string | null) {
    if (value === null) {
        state.value = null;
        emit('updated', { ...state });
        return;
    }

    const prepared = filterAndTransform(value ?? state.value);
    if (prepared === state.value) {
        return;
    }

    state.value = prepared;
    emit('updated', { ...state });
}

watch(
    () => props.value,
    () => {
        update(props.value);
    }
);

watch(
    () => props.allowedCharacters,
    () => {
        characterRegex.value = getRegex(props.allowedCharacters);
        update();
    }
);

watch([() => props.transformInput, () => props.max], () => {
    update();
});

/**
 * Filter the pasted value by the allowed character format
 */
const filterPasteData = (event: ClipboardEvent): void => {
    update(event.clipboardData?.getData('text'));
};

/**
 * Filter the user's inputted value by the allowed character format
 */
const filterInputData = (event: Event): void => {
    update((<HTMLInputElement>event.target).value);
};

/**
 * Prevent any unallowed characters
 */
const preventUnallowedCharacters = (event: KeyboardEvent): void => {
    if (characterRegex.value && !characterRegex.value.test(event.key)) {
        event.preventDefault();
    }
};

watch(
    () => props.focus,
    (received: boolean) => {
        if (focused.value === received) {
            return;
        }

        !received ? element.value?.blur() : element.value?.focus();
    }
);

/**
 * Filter and transform the provided value
 */
function filterAndTransform(value?: string): string {
    let filtered = filter(value?.trimStart(), characterRegex.value);
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

    if (!!props.value && (props.allowedCharacters || props.transformInput || props.max)) {
        state.value = filterAndTransform(props.value);
    }

    emit('created', { ...state });
});
</script>

<style lang="postcss" scoped>
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
