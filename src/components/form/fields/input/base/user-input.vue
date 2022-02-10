<template>
    <component :is="textarea ? 'textarea' : 'input'" class="user-input" :class="{ focused }" :id="name" :name="name" :value="model" @blur="blur" @focus="focus" @input="model = $event.target.value" />
</template>

<script lang="ts" setup>
import { EmitEvents } from '@/components/types';
import { FieldData } from '@/composables/types';
import { computed, reactive, ref } from 'vue';

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
    textarea: {
        type: Boolean,
        required: false,
        default: false
    }
});

const focused = ref(false);

const state = reactive({
    name: props.name,
    value: null
} as FieldData);

const model = computed({
    get: () => state.value,
    set: (value: string) => {
        state.value = value.trim();

        emit(EmitEvents.UPDATED, state);
    }
});

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
    outline: none;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    width: 100%;
}
</style>
