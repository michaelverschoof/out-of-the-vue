<template>
    <component
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
import { EmitEvents } from '@/components/types';
import { StringFieldData } from '@/composables/types';
import { computed, reactive, ref, watch } from 'vue';

const emit = defineEmits<{
    (event: EmitEvents.BLURRED): void;
    (event: EmitEvents.FOCUSED): void;
    (event: EmitEvents.CREATED, data: StringFieldData): void;
    (event: EmitEvents.UPDATED, data: StringFieldData): void;
}>();

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: false,
        default: null
    },
    textarea: {
        type: Boolean,
        required: false,
        default: false
    },
    allowedCharacters: {
        type: String,
        required: false,
        default: null
    }
});

const focused = ref<boolean>(false);

const state = reactive<StringFieldData>({
    name: props.name,
    value: props.value ?? null
});

const model = computed({
    get: () => state.value,
    set: (value: string) => {
        state.value = value.trim();
        emit(EmitEvents.UPDATED, state);
    }
});

watch(() => props.value, (received: string): void => {
    if (received === model.value) {
        return;
    }

    model.value = filter(received);
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

const filter = (value: string): string => {
    return inputRegex ? (value.match(inputRegex) || []).join('') : value;
};

const focus = (): void => {
    focused.value = true;
    emit(EmitEvents.FOCUSED);
};

const blur = (): void => {
    focused.value = false;
    emit(EmitEvents.BLURRED);
};

emit(EmitEvents.CREATED, state);
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
