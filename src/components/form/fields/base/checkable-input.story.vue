<template>
    <story title="Components/Form/Fields/Base/Checkable input" :layout="{ type: 'grid', width: 400 }" auto-props-disabled>
        <checkable-input
            name="histoire-checkable-input"
            :value="state.value"
            :type="state.type"
            :checked="state.checked"
            @focused="logEvent('focused', $event)"
            @blurred="logEvent('blurred', $event)"
            @created="logEvent('created', $event)"
            @updated="update"
        />

        <template #controls>
            <hst-text v-model="state.value" title="Value" />
            <hst-button-group v-model="state.type" title="Input type" :options="types" />
            <hst-checkbox v-model="state.checked" title="Checked" />
        </template>
    </story>
</template>

<script lang="ts" setup>
import CheckableInput from '@/components/form/fields/base/checkable-input.vue';
import { logEvent } from 'histoire/client';
import { reactive } from 'vue';

interface State {
    value: string;
    type: 'radio' | 'checkbox';
    checked: boolean;
}

const types = [
    { label: 'Radio', value: 'radio' },
    { label: 'Checkbox', value: 'checkbox' }
];

const state = reactive<State>({
    value: 'test',
    type: 'radio',
    checked: false
});

const update = (event: any) => {
    state.checked = event.checked;
    logEvent('updated', event);
};
</script>

<docs lang="md">
# Numeric input

Base input for number fields.
Allows decimals and negative values by default, but these can be disabled.
</docs>
