<template>
    <story title="Form/Fields/Base/Numeric input" :layout="{ type: 'grid', width: 400 }" auto-props-disabled>
        <numeric-input
            name="histoire-numeric-input"
            :value="state.value"
            :allow-decimals="state.allowDecimals"
            :allow-negative="state.allowNegative"
            @focused="logEvent('focused', $event)"
            @blurred="logEvent('blurred', $event)"
            @created="logEvent('created', $event)"
            @updated="update"
        />

        <template #controls>
            <hst-number v-model="state.value" title="Value" />
            <hst-checkbox v-model="state.allowDecimals" title="Allow decimals" />
            <label class="histoire-wrapper htw-p-2 htw-flex htw-gap-2 htw-flex-wrap">
                <span class="htw-w-28 htw-shrink-0" />
                <span class="htw-grow htw-max-w-full htw-flex htw-items-center htw-gap-1">
                    <hst-button :disabled="!state.allowDecimals" class="htw-p-2" :color="!state.allowDecimals || 'primary'" @click="toggleDecimal">
                        Toggle decimal
                    </hst-button>
                </span>
            </label>

            <hst-checkbox v-model="state.allowNegative" title="Allow negative numbers" />
            <label class="histoire-wrapper htw-p-2 htw-flex htw-gap-2 htw-flex-wrap">
                <span class="htw-w-28 htw-shrink-0" />
                <span class="htw-grow htw-max-w-full htw-flex htw-items-center htw-gap-1">
                    <hst-button :disabled="!state.allowNegative" class="htw-p-2" :color="state.allowNegative ? 'primary' : ''" @click="toggleMinus">
                        Toggle minus sign
                    </hst-button>
                </span>
            </label>
        </template>
    </story>
</template>

<script lang="ts" setup>
import NumericInput from '@/components/form/fields/base/numeric-input.vue';
import { toggleDecimalInValue, toggleMinusInValue } from '@test/functions/numbers';
import { logEvent } from 'histoire/client';
import { reactive, ref } from 'vue';

const state = reactive({
    value: -123.45,
    allowDecimals: true,
    allowNegative: true
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

const update = (event: any) => {
    state.value = event.value;
    logEvent('updated', event);
};
</script>

<docs lang="md">
# Numeric input

Base input for number fields.
Allows decimals and negative values by default, but these can be disabled.
</docs>
