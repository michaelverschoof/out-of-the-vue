<template>
    <component
        :is="textarea ? 'textarea' : 'input'"
        :id="name"
        ref="element"
        class="user-input"
        :class="{ focused }"
        :name="name"
        :value="model"
        @blur="blurElement"
        @focus="focusElement"
        @input="filterInputData"
        @keypress="preventDisallowedCharacters"
        @paste="filterPasteData"
    />
</template>

<script lang="ts" setup>
import { OptionalProps, RequiredProps } from '@/components/props.types';
import { InputTransformType, StringFieldData } from '@/composables/types';
import { useUserInput } from '@/composables/user-input';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const emit = defineEmits<{
    (event: 'blurred'): void;
    (event: 'focused'): void;
    (event: 'created', data: StringFieldData): void;
    (event: 'updated', data: StringFieldData): void;
}>();

const props = defineProps({
    name: RequiredProps.string,
    value: OptionalProps.string,
    textarea: OptionalProps.booleanFalse,
    focus: OptionalProps.booleanFalse,
    allowedCharacters: OptionalProps.string,
    transformInput: {
        type: String as () => InputTransformType,
        required: false,
        default: null
    }
});

const element = ref<HTMLInputElement | HTMLTextAreaElement>(null);
const focused = ref<boolean>(false);

const state = reactive<StringFieldData>({
    name: props.name,
    value: props.value ?? null
});

const model = computed({
    get: () => state.value,
    set: (value: string) => {
        state.value = value?.trim() ?? null;
        emit('updated', state);
    }
});

watch(() => props.value, (received: string): void => {
    if (received === model.value) {
        return;
    }

    model.value = filterAndTransform(received);
});

watch(() => props.focus, (received: boolean) => {
    if (!element.value) {
        return;
    }

    !received ? element.value.blur() : element.value.focus();
});

/**
 * The regex containing the allowed characters
 */
const inputRegex = !!props.allowedCharacters ? new RegExp(props.allowedCharacters, 'g') : null;

/**
 * Prevent characters other than the allowed to be entered
 */
const preventDisallowedCharacters = (event: KeyboardEvent): string => {
    if (!inputRegex || event.key.match(inputRegex)) {
        return event.key;
    }

    event.preventDefault();
};

/**
 * Filter the pasted value by the allowed character format
 */
const filterPasteData = (event: ClipboardEvent): void => {
    const data = event.clipboardData;
    data.setData('text', filterAndTransform(data.getData('text')));
};

/**
 * Filter the user's inputted value by the allowed character format
 */
const filterInputData = (event: Event): void => {
    model.value = filterAndTransform((<HTMLInputElement> event.target).value);
};

const { filter, transform } = useUserInput();
const filterAndTransform = (value: string): string => {
    const filtered = filter(value, inputRegex);
    if (!props.transformInput) {
        return filtered;
    }

    return transform(filtered, props.transformInput);
};

const focusElement = (): void => {
    focused.value = true;
    emit('focused');
};

const blurElement = (): void => {
    focused.value = false;
    emit('blurred');
};

onMounted(() => {
    if (!props.focus) {
        return;
    }
    element.value.focus();
});

emit('created', state);
</script>

<style lang="scss" scoped>
.user-input {
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
