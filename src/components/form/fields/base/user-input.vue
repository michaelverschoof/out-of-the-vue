<template>
    <component
        ref="element"
        :is="textarea ? 'textarea' : 'input'"
        class="user-input"
        :class="{ focused }"
        :id="name"
        :name="name"
        :value="model"
        @blur="blur"
        @focus="focus"
        @input="filterInputData"
        @keypress="preventDisallowedCharacters"
        @paste="filterPasteData"
    />
</template>

<script lang="ts" setup>
import { OptionalProps, RequiredProps } from '@/components/props.types';
import { StringFieldData } from '@/composables/types';
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
    allowedCharacters: OptionalProps.string,
    value: OptionalProps.string,
    textarea: OptionalProps.booleanFalse,
    focusing: OptionalProps.booleanFalse
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

    model.value = filter(received);
});

watch(() => props.focusing, (received: boolean) => {
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
 * Filter the value by the allowed character format
 */
const filterPasteData = (event: ClipboardEvent): void => {
    const data = event.clipboardData;
    data.setData('text', filter(data.getData('text')));
};

const filterInputData = (event: Event): void => {
    model.value = filter((<HTMLInputElement> event.target).value);
};

const { filter: filterData } = useUserInput();
const filter = (value: string): string => {
    return value ? filterData(value, inputRegex) : null;
};

const focus = (): void => {
    focused.value = true;
    emit('focused');
};

const blur = (): void => {
    focused.value = false;
    emit('blurred');
};

onMounted(() => {
    if (!props.focusing) {
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
