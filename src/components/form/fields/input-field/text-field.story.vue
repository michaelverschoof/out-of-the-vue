<template>
    <Story title="Form/Fields/Text field" :layout="{ type: 'grid', width: 400 }" auto-props-disabled>
        <Variant title="Simple">
            <text-field
                name="histoire-text-field-simple"
                :value="state.value"
                :typing-delay="state.delay"
                :max-length="state.maxLength"
                @created="logEvent('created', $event)"
                @updated="logEvent('updated', $event)"
            />
        </Variant>

        <Variant title="With label and information">
            <text-field
                name="histoire-text-field-labels"
                :value="state.value"
                :typing-delay="state.delay"
                :max-length="state.maxLength"
                @created="logEvent('created', $event)"
                @updated="logEvent('updated', $event)"
            >
                <template #label>Field label</template>
                <template #information><i>Helpful text on how to fill in the field</i></template>
            </text-field>
        </Variant>

        <Variant title="With inner icons">
            <text-field
                name="histoire-text-field-inner-icons"
                :typing-delay="state.delay"
                :max-length="state.maxLength"
                :value="state.value"
                @created="logEvent('created', $event)"
                @updated="logEvent('updated', $event)"
            >
                <template #label>Field label</template>
                <template #information>Helpful text on how to fill in the field</template>
                <template #prepend><icon icon="mdi:airballoon" /></template>
                <template #append><icon icon="mdi:airplane" /></template>
            </text-field>
        </Variant>

        <Variant title="With outer icons">
            <prepend-append>
                <text-field
                    name="histoire-text-field-outer-icons"
                    :typing-delay="state.delay"
                    :max-length="state.maxLength"
                    :value="state.value"
                    @created="logEvent('created', $event)"
                    @updated="logEvent('updated', $event)"
                >
                    <template #label>Field label</template>
                    <template #information>Helpful text on how to fill in the field</template>
                </text-field>
                <template #prepend><icon icon="mdi:airballoon" /></template>
                <template #append><icon icon="mdi:airplane" /></template>
            </prepend-append>
        </Variant>

        <Variant title="With inner and outer icons">
            <prepend-append>
                <text-field
                    name="histoire-text-field-inner-and-outer-icons"
                    :typing-delay="state.delay"
                    :max-length="state.maxLength"
                    :value="state.value"
                    @created="logEvent('created', $event)"
                    @updated="logEvent('updated', $event)"
                >
                    <template #label>Field label</template>
                    <template #information>Helpful text on how to fill in the field</template>
                    <template #prepend><icon icon="mdi:airballoon" /></template>
                    <template #append><icon icon="mdi:airplane" /></template>
                </text-field>
                <template #prepend><icon icon="mdi:airballoon" /></template>
                <template #append><icon icon="mdi:airplane" /></template>
            </prepend-append>
        </Variant>

        <Variant title="With validations">
            <text-field
                name="histoire-text-field-validations"
                :value="state.value"
                :typing-delay="state.delay"
                :max="state.max"
                :min="state.min"
                @created="logEvent('created', $event)"
                @updated="logEvent('updated', $event)"
            >
                <template #label>Field label</template>
                <template #information><i>Helpful text on how to fill in the field</i></template>
                <template #required>Required error message</template>
                <template #min>Minimum length error message</template>
                <template #max>Maximum length error message</template>
            </text-field>

            <template #controls>
                <hst-checkbox v-model="state.required" title="Required field" />
                <hst-slider v-model="state.min" :step="1" :min="0" :max="20" title="Minimum length" />
                <hst-slider v-model="state.max" :step="1" :min="0" :max="20" title="Maximum length" />

                <label class="histoire-wrapper htw-p-2 htw-flex htw-gap-2 htw-flex-wrap htw-items-center">
                    <span class="htw-w-28 htw-shrink-0">Validate field</span>
                    <span class="htw-grow htw-max-w-full htw-flex htw-items-center htw-gap-1">
                        <hst-button class="htw-p-2" @click="validate = !validate"> Validate = {{ validate }}</hst-button>
                    </span>
                </label>
            </template>
        </Variant>

        <template #controls>
            <show-grid-lines show />

            <hst-slider v-model="state.maxLength" :step="1" :min="0" :max="30" title="Maximum length" />
            <hst-slider v-model="state.delay" :step="100" :min="0" :max="1000" title="Typing delay" />
        </template>
    </Story>
</template>

<script lang="ts" setup>
import TextField from '@/components/form/fields/input-field/text-field.vue';
import PrependAppend from '@/components/layout/prepend-append.vue';
import { Icon } from '@iconify/vue';
import ShowGridLines from '@test/components/show-grid-lines.vue';
import { logEvent } from 'histoire/client';
import { reactive, ref } from 'vue';

const validate = ref<boolean>(false);

const submit = () => {
    console.log('submit');
    console.log(state.value);
};

const state = reactive({
    value: 'Some value',
    delay: 200,
    required: true,
    min: 3,
    max: 15,
    maxLength: 25
});
</script>

<docs lang="md">
# Text field

The text field provides a structured way of building form fields.

This field allows for debouncing input and custom validations with pre-built validations enabled by default.
It also contains the structure to add a label above the input, hint information below the input, error messages and prepended/appended icons.

All of these can be any text or HTML that you want so you can build the field how you want it.
</docs>
