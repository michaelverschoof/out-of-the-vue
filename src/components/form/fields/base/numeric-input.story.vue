<template>
    <story title="Components/Form/Fields/Base/Numeric input" :layout="{ type: 'grid', width: 400 }" auto-props-disabled>
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
import { reactive, ref } from 'vue';
import NumericInput from './numeric-input.vue';
import { logEvent } from 'histoire/client';

const state = reactive({
    value: -123.45,
    allowDecimals: true,
    allowNegative: true
});

const previousDecimal = ref<number>(null);
const toggleDecimal = () => {
    const current = state.value.toString().replace(',', '.');
    const index = current.indexOf('.');
    if (index === -1) {
        if (previousDecimal.value && current.length > previousDecimal.value) {
            state.value = Number(injectDecimal(current, previousDecimal.value));
            return;
        }

        state.value = Number(current.length > 2 ? injectDecimal(current, -2) : current + '.12');
        return;
    }

    previousDecimal.value = index;
    state.value = Number(current.replace('.', ''));
};

const toggleMinus = () => {
    const current = state.value.toString();
    if (current.startsWith('-')) {
        state.value = Number(current.slice(1));
        return;
    }

    state.value = Number('-' + current);
};

const update = (event: any) => {
    state.value = event.value;
    logEvent('updated', event);
};

function injectDecimal(value: string, index: number) {
    return value.slice(0, index) + '.' + value.slice(index);
}
</script>

<docs lang="md">
# Numeric input

Base input for number fields.
Allows decimals and negative values by default, but these can be disabled.
</docs>
