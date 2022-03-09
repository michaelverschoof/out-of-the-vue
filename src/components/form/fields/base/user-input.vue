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
        @keypress="preventDisallowedCharacters"
        @input="filterDisallowedCharacters"
    />
</template>

<script lang="ts" setup>
import { EmitEvents } from '@/components/types';
import { FieldData } from '@/composables/types';
import { computed, reactive, ref, watch } from 'vue';

const emit = defineEmits<{
    (event: EmitEvents.BLURRED): void;
    (event: EmitEvents.FOCUSED): void;
    (event: EmitEvents.CREATED, data: FieldData): void;
    (event: EmitEvents.UPDATED, data: FieldData): void;
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
    },
    allowedCharacterFormat: {
        type: String,
        required: false,
        default: null
    }
});

const focused = ref(false);

const state = reactive<FieldData>({
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

    model.value = received;
});

/**
 * Prevent characters other than provided to be entered
 */
const inputRegex = new RegExp(props.allowedCharacters, 'g');
const preventDisallowedCharacters = (event: KeyboardEvent): void => {
    if (!props.allowedCharacters || event.key.match(inputRegex)) {
        return;
    }

    event.preventDefault();
};

/**
 * Filter the value by the allowed character format
 */
const formatRegex = new RegExp(props.allowedCharacterFormat);
const filterDisallowedCharacters = (event: Event): void => {
    if (!props.allowedCharacters) {
        model.value = (<HTMLInputElement> event.target).value;
        return;
    }

    const filtered = (<HTMLInputElement> event.target).value.match(formatRegex) || [];
    model.value = filtered.join('');
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
