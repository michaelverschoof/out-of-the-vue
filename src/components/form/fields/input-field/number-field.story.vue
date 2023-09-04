<template>
    <Story title="Form/Fields/Number field" :layout="{ type: 'grid', width: 400 }" auto-props-disabled>
        <Variant title="Simple">
            <number-field
                name="histoire-number-field-simple"
                :value="state.value"
                :typing-delay="state.delay"
                :allow-decimals="true"
                :allow-negative="true"
                required
                @created="logEvent('created', $event)"
                @updated="logEvent('updated', $event)"
            />
        </Variant>

        <Variant title="With label and information">
            <number-field
                name="histoire-number-field-labels"
                :value="state.value"
                :allow-decimals="true"
                :allow-negative="true"
                required
                @created="logEvent('created', $event)"
                @updated="logEvent('updated', $event)"
            >
                <template #label>Field label</template>
                <template #information><i>Helpful text on how to fill in the field</i></template>
            </number-field>
        </Variant>

        <Variant title="With inner icons">
            <number-field
                name="histoire-number-field-inner-icons"
                :value="state.value"
                :allow-decimals="true"
                :allow-negative="true"
                required
                @created="logEvent('created', $event)"
                @updated="logEvent('updated', $event)"
            >
                <template #label>Field label</template>
                <template #information>Helpful text on how to fill in the field</template>
                <template #prepend><icon icon="mdi:airballoon" /></template>
                <template #append><icon icon="mdi:airplane" /></template>
            </number-field>
        </Variant>

        <Variant title="With outer icons">
            <prepend-append>
                <number-field
                    name="histoire-number-field-outer-icons"
                    :value="state.value"
                    :allow-decimals="true"
                    :allow-negative="true"
                    @created="logEvent('created', $event)"
                    @updated="logEvent('updated', $event)"
                >
                    <template #label>Field label</template>
                    <template #information>Helpful text on how to fill in the field</template>
                </number-field>
                <template #prepend><icon icon="mdi:airballoon" /></template>
                <template #append><icon icon="mdi:airplane" /></template>
            </prepend-append>
        </Variant>

        <Variant title="With inner and outer icons">
            <prepend-append>
                <number-field
                    name="histoire-number-field-inner-and-outer-icons"
                    :value="state.value"
                    :allow-decimals="true"
                    :allow-negative="true"
                    @created="logEvent('created', $event)"
                    @updated="logEvent('updated', $event)"
                >
                    <template #label>Field label</template>
                    <template #information>Helpful text on how to fill in the field</template>
                    <template #prepend><icon icon="mdi:airballoon" /></template>
                    <template #append><icon icon="mdi:airplane" /></template>
                </number-field>
                <template #prepend><icon icon="mdi:airballoon" /></template>
                <template #append><icon icon="mdi:airplane" /></template>
            </prepend-append>
        </Variant>

        <Variant title="With validations">
            <template #default>
                <number-field
                    name="histoire-number-field-validations"
                    :value="state.value"
                    :allow-decimals="true"
                    :allow-negative="true"
                    :min="state.min"
                    :max="state.max"
                    required
                    @created="logEvent('created', $event)"
                    @updated="logEvent('updated', $event)"
                >
                    <template #append><icon icon="mdi:airplane" /></template>

                    <template #label>Field label</template>
                    <template #information>Helpful text on how to fill in the field</template>
                    <template #required>Required error message</template>
                    <template #min>Minimum amount error message</template>
                    <template #max>Maximum amount error message</template>
                </number-field>
            </template>

            <template #controls>
                <hst-slider v-model="state.min" :step="100" :min="0" :max="1000" title="Minimum value" />
                <hst-slider v-model="state.max" :step="100" :min="1000" :max="2000" title="Maximum value" />

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

            <hst-text v-model="stringValue" title="Value" />

            <hst-slider v-model="state.delay" :step="100" :min="0" :max="1000" title="Typing delay" />

            <h3>Validations</h3>
            <hst-checkbox v-model="state.required" title="Required field" />

            <hst-checkbox v-model="state.allowDecimals" title="Allow decimals" />
            <label class="histoire-wrapper htw-p-2 htw-flex htw-gap-2 htw-flex-wrap">
                <span class="htw-w-28 htw-shrink-0" />
                <span class="htw-grow htw-max-w-full htw-flex htw-items-center htw-gap-1">
                    <hst-button :disabled="!state.allowDecimals" class="htw-p-2" @click="toggleDecimal"> Toggle decimal </hst-button>
                </span>
            </label>

            <hst-checkbox v-model="state.allowNegative" title="Allow negative numbers" />
            <label class="histoire-wrapper htw-p-2 htw-flex htw-gap-2 htw-flex-wrap">
                <span class="htw-w-28 htw-shrink-0" />
                <span class="htw-grow htw-max-w-full htw-flex htw-items-center htw-gap-1">
                    <hst-button :disabled="!state.allowNegative" class="htw-p-2" @click="toggleMinus"> Toggle minus sign </hst-button>
                </span>
            </label>
        </template>
    </Story>
</template>

<script lang="ts" setup>
import NumberField from '@/components/form/fields/input-field/number-field.vue';
import PrependAppend from '@/components/layout/prepend-append.vue';
import { SubmittedSymbol } from '@/composables/types';
import { Icon } from '@iconify/vue';
import ShowGridLines from '@test/components/show-grid-lines.vue';
import { toggleDecimalInValue, toggleMinusInValue } from '@test/functions/numbers';
import { logEvent } from 'histoire/client';
import { computed, provide, reactive, ref } from 'vue';

const validate = ref<boolean>(false);
provide(SubmittedSymbol, validate);

const stringValue = computed({
    get: () => state.value?.toString(),
    set: (value) => {
        state.value = !!value ? Number(value) : null;
    }
});

const state = reactive({
    value: 1234.56,
    delay: 200,
    allowDecimals: true,
    allowNegative: true,
    required: true,
    min: 200,
    max: 1200
});

const previousDecimal = ref<number>(null);
const toggleDecimal = () => {
    const { value, index } = toggleDecimalInValue(state.value, previousDecimal.value);
    state.value = value;
    previousDecimal.value = index;
};

const toggleMinus = () => {
    state.value = toggleMinusInValue(state.value);
};
</script>

<docs lang="md">
# Number field

The number field provides a structured way of building form fields.

This field allows for debouncing input and custom validations with pre-built validations enabled by default.
It also contains the structure to add a label above the input, hint information below the input, error messages and prepended/appended icons.

All of these can be any text or HTML that you want so you can build the field how you want it.
</docs>
