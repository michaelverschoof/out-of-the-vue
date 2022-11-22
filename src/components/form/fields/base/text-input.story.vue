<template>
    <story title="Components/Form/Fields/Base/Text input" :layout="{ type: 'grid', width: 400 }" auto-props-disabled>
        <text-input
            name="histoire-text-input"
            :value="state.value"
            :max="state.max"
            :transformInput="state.transform"
            :allowedCharacters="state.characters"
            :textarea="state.type === 'textarea'"
            :focus="state.focus"
            @focused="logEvent('focused', $event)"
            @blurred="logEvent('blurred', $event)"
            @created="logEvent('created', $event)"
            @updated="logEvent('updated', $event)"
        />

        <template #controls>
            <hst-text v-model="state.value" title="Value" />
            <hst-button-group v-model="state.type" title="Input type" :options="types" />
            <hst-button-group v-model="state.transform" title="Transform value" :options="transformOptions" />
            <hst-checkbox v-model="state.focus" title="Focus" />
            <hst-slider v-model="state.max" :step="1" :min="0" :max="20" title="Maximum length" />
        </template>
    </story>
</template>

<script lang="ts" setup>
import TextInput from '@/components/form/fields/base/text-input.vue';
import { logEvent } from 'histoire/client';
import { reactive } from 'vue';

const types = [
    { label: 'Input', value: 'input' },
    { label: 'Textarea', value: 'textarea' }
];

const transformOptions = [
    { label: 'Uppercase', value: 'uppercase' },
    { label: 'Lowercase', value: 'lowercase' }
];

const state = reactive({
    value: 'Some Value',
    type: 'input',
    transform: null,
    focus: false,
    max: null,
    characters: null
});
</script>

<docs lang="md">
# Text input

Base input for fields
</docs>
