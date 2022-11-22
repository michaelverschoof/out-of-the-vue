<template>
    <story title="Components/Input field/Text field" :layout="{ type: 'grid', width: 400 }" auto-props-disabled>
        <variant title="Simple">
            <text-field
                name="histoire-text-field"
                :value="state.value"
                :typing-delay="state.delay"
                @created="logEvent('created', $event)"
                @updated="logEvent('updated', $event)"
            />
        </variant>

        <variant title="With label and information">
            <text-field name="histoire-text-field-2" :value="state.value" @created="logEvent('created', $event)" @updated="logEvent('updated', $event)">
                <template #label>Field label</template>
                <template #information><i>Helpful text on how to fill in the field</i></template>
            </text-field>
        </variant>

        <variant title="With inner icons">
            <text-field name="histoire-text-field-3" :value="state.value" @created="logEvent('created', $event)" @updated="logEvent('updated', $event)">
                <template #label>Field label</template>
                <template #information>Helpful text on how to fill in the field</template>
                <template #prepend><icon icon="mdi:airballoon" /></template>
                <template #append><icon icon="mdi:airplane" /></template>
            </text-field>
        </variant>

        <variant title="With outer icons">
            <prepend-append>
                <text-field name="histoire-text-field-3" :value="state.value" @created="logEvent('created', $event)" @updated="logEvent('updated', $event)">
                    <template #label>Field label</template>
                    <template #information>Helpful text on how to fill in the field</template>
                </text-field>
                <template #prepend><icon icon="mdi:airballoon" /></template>
                <template #append><icon icon="mdi:airplane" /></template>
            </prepend-append>
        </variant>

        <variant title="With inner and outer icons">
            <prepend-append>
                <text-field name="histoire-text-field-3" :value="state.value" @created="logEvent('created', $event)" @updated="logEvent('updated', $event)">
                    <template #label>Field label</template>
                    <template #information>Helpful text on how to fill in the field</template>
                    <template #prepend><icon icon="mdi:airballoon" /></template>
                    <template #append><icon icon="mdi:airplane" /></template>
                </text-field>
                <template #prepend><icon icon="mdi:airballoon" /></template>
                <template #append><icon icon="mdi:airplane" /></template>
            </prepend-append>
        </variant>

        <template #controls>
            <show-grid-lines show />

            <hst-slider v-model="state.delay" :step="100" :min="0" :max="1000" title="Typing delay" />

            <h3>Validations</h3>
            <hst-checkbox v-model="state.required" title="Required field" />
            <hst-slider v-model="state.min" :step="1" :min="0" :max="20" title="Minimum length" />
            <hst-slider v-model="state.max" :step="1" :min="0" :max="20" title="Maximum length" />
        </template>
    </story>
</template>

<script lang="ts" setup>
import TextField from '@/components/form/fields/input-field/text-field.vue';
import PrependAppend from '@/components/layout/prepend-append.vue';
import { Icon } from '@iconify/vue';
import ShowGridLines from '@test/components/show-grid-lines.vue';
import { logEvent } from 'histoire/client';
import { reactive } from 'vue';

const state = reactive({
    value: 'Some value',
    delay: 200,
    required: true,
    min: 3,
    max: 15
});
</script>

<docs lang="md">
# Text field

The text field provides a structured way of building form fields.
This field allows for validations with pre-built validations enabled by default.
It also contains the structure to add a label above the input,
hint information below the input, error messages and prepended/appended icons.
All of these can be any text or HTML that you want so you can build the field how you want it.
</docs>
