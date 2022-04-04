<template>
    <input
        ref="element"
        class="checkable-input"
        autocomplete="off"
        :type="type"
        :id="`${name}-${value}`"
        :name="name"
        :checked="state.checked"
        v-model="model"
        @click="reselect"
    />
</template>

<script lang="ts" setup>
import { OptionalProps, RequiredProps } from '@/components/props.types';
import { CheckableFieldData, UpdateEmitType } from '@/composables/types';
import { computed, reactive, ref } from 'vue';

const emit = defineEmits<{ (event: UpdateEmitType, data: CheckableFieldData): void; }>();

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

const state = reactive<CheckableFieldData>({
    name: props.name,
    value: props.value,
    checked: props.checked
});

const model = computed({
    get: () => state.checked,
    set: () => {
        state.checked = element.value.checked;
        emit('updated', state);
    }
});

const reselect = () => {
    if (props.type !== 'radio' || !state.checked) {
        return;
    }

    emit('updated', state);
};

emit('created', state);
</script>
