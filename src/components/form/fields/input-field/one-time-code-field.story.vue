<template>
    <story title="Form/Fields/One time code field" :layout="{ type: 'grid', width: 400 }" auto-props-disabled>
        <variant title="Simple">
            <one-time-code-field
                name="histoire-one-time-code-field-simple"
                :focus="state.focus"
                :type="state.type"
                :length="state.length"
                @created="logEvent('created', $event)"
                @updated="logEvent('updated', $event)"
            />
        </variant>

        <variant title="With label and information">
            <one-time-code-field
                name="histoire-one-time-code-field-labels"
                :focus="state.focus"
                :type="state.type"
                :length="state.length"
                @created="logEvent('created', $event)"
                @updated="logEvent('updated', $event)"
            >
                <template #label>Field label</template>
                <template #information><i>Helpful text on how to fill in the field</i></template>
            </one-time-code-field>
        </variant>

        <variant title="With outer icons">
            <prepend-append>
                <one-time-code-field
                    name="histoire-one-time-code-field-labels"
                    :focus="state.focus"
                    :type="state.type"
                    :length="state.length"
                    @created="logEvent('created', $event)"
                    @updated="logEvent('updated', $event)"
                >
                    <template #label>Field label</template>
                    <template #information><i>Helpful text on how to fill in the field</i></template>
                </one-time-code-field>
                <template #prepend><icon icon="mdi:airballoon" /></template>
                <template #append><icon icon="mdi:airplane" /></template>
            </prepend-append>
        </variant>

        <template #controls>
            <show-grid-lines show />

            <hst-checkbox v-model="state.focus" title="Focus" />
            <hst-slider v-model="state.length" :step="1" :min="1" :max="10" title="Length" />
            <hst-button-group v-model="state.type" title="Input type" :options="['alpha', 'numeric', 'alphanumeric']" />
        </template>
    </story>
</template>

<script lang="ts" setup>
import OneTimeCodeField from '@/components/form/fields/input-field/one-time-code-field.vue';
import PrependAppend from '@/components/layout/prepend-append.vue';
import { Icon } from '@iconify/vue';
import ShowGridLines from '@test/components/show-grid-lines.vue';
import { logEvent } from 'histoire/client';
import { reactive } from 'vue';

const state = reactive({
    focus: false,
    type: 'alphanumeric' as 'alpha' | 'numeric' | 'alphanumeric',
    length: 6
});
</script>

<docs lang="md">
# Text field

The one time code field provides a structured way of building form fields.

This field allows for custom validations with pre-built validations enabled by default.
It also contains the structure to add a label above the input, hint information below the input and error messages.

All of these can be any text or HTML that you want so you can build the field how you want it.
</docs>
