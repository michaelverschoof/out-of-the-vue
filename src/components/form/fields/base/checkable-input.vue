<template>
    <input
        ref="element"
        class="checkable-input"
        :class="{ focused }"
        autocomplete="off"
        :type="type"
        :id="`${name}-${value}`"
        :name="name"
        :checked="checked"
        v-model="model"
        @focus="focusElement"
        @blur="blurElement"
        @click="reselect"
    />
</template>

<script lang="ts" setup>
import { OptionalProps, RequiredProps } from '@/components/props.types';
import { CheckableFieldData, FocusEmitType, UpdateEmitType } from '@/composables/types';
import { computed, reactive, ref, watch } from 'vue';

const emit = defineEmits<{
    (event: FocusEmitType): void;
    (event: UpdateEmitType, data: CheckableFieldData): void;
}>();

const props = defineProps({
    name: RequiredProps.string,
    value: RequiredProps.string,
    checked: OptionalProps.booleanFalse,
    type: {
        type: String as () => 'radio' | 'checkbox',
        required: true
    }
});

const element = ref<HTMLInputElement>();
const focused = ref<boolean>(false);

const state = reactive<CheckableFieldData>({
    name: props.name,
    value: props.value,
    checked: props.checked
});

const model = computed({
    get: () => state.checked,
    set: () => {
        state.checked = element.value.checked;
        emit('updated', { ...state });
    }
});

watch(() => props.checked, (received: boolean) => {
    state.checked = received;
});

const reselect = () => {
    if (props.type !== 'radio' || !state.checked) {
        return;
    }

    emit('updated', { ...state });
};

const focusElement = (): void => {
    focused.value = true;
    emit('focused');
};

const blurElement = (): void => {
    focused.value = false;
    emit('blurred');
};

emit('created', { ...state });
</script>
