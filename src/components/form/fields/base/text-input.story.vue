<template>
    <story title="Components/Form/Fields/Base/Text input" :layout="{ type: 'grid', width: 400 }">
        <variant title="Basic input">
            <text-input name="histoire-text-input" :value="state.value" :transformInput="state.transform" />
        </variant>

        <variant title="Maximum of 8 characters">
            <text-input name="histoire-text-input-length" :value="state.value" :max="8" :transformInput="state.transform" />
        </variant>

        <variant title="Allow only letters">
            <text-input name="histoire-text-input-characters" :value="state.value" :transformInput="state.transform" allowedCharacters="letters" />
        </variant>

        <variant title="Basic textarea">
            <text-input name="histoire-textarea" :value="state.value" textarea rows="3" cols="10" :transformInput="state.transform" />
        </variant>

        <template #controls>
            <hst-text v-model="state.value" title="Value" />
            <hst-button-group v-model="state.transform" title="Transform value" :options="transformOptions" />
        </template>
    </story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import TextInput from './text-input.vue';

const transformOptions = [
    {
        label: 'Uppercase',
        value: 'uppercase'
    },
    {
        label: 'Lowercase',
        value: 'lowercase'
    }
];

const state = reactive({
    value: 'Some Value',
    transform: null
});
</script>

<docs lang="md">
# Text input

Base input for fields
</docs>
