<template>
    <input
        autocomplete="off"
        class="checkable-input"
        ref="element"
        v-model="model"
        :checked="state.checked"
        :class="{ focused }"
        :id="`${name}-${value}`"
        :name="name"
        :type="type"
        @blur="blur"
        @focus="focus"
        @click="reselect"
    />
</template>

<script lang="ts" setup>
import { CheckableFieldData } from '@/composables/types';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const emit = defineEmits<{
    (event: 'focused' | 'blurred'): void;
    (event: 'created' | 'updated', data: CheckableFieldData): void;
}>();

const props = defineProps<{ type: 'radio' | 'checkbox'; name: string; value: string; checked?: boolean }>();

const element = ref<HTMLInputElement>();
const focused = ref<boolean>(false);

const state = reactive<CheckableFieldData>({
    name: props.name,
    value: props.value,
    checked: props.checked ?? false
});

const model = computed<boolean>({
    get: () => state.checked,
    set: () => {
        state.checked = !!element.value?.checked;
        emit('updated', { ...state });
    }
});

watch(
    () => props.checked,
    (received?: boolean) => {
        state.checked = !!received;
    }
);

const reselect = (): void => {
    if (props.type !== 'radio' || !state.checked) {
        return;
    }

    emit('updated', { ...state });
};

const focus = (): void => {
    focused.value = true;
    emit('focused');
};

const blur = (): void => {
    focused.value = false;
    emit('blurred');
};

onMounted(() => emit('created', { ...state }));
</script>
