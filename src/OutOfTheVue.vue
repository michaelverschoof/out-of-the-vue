<template>
    <div>
        <one-time-code-field name="myOneTimeCode" required @updated="onUpdated" focus>
            <template #label>
                Some field label
            </template>
            <template #information>
                Some info
            </template>
            <template #required>
                This field is required
            </template>
        </one-time-code-field>
    </div>

    <div>
        <number-field :typing-delay="1000" name="myNumberField" required @updated="onUpdated" :min="2" :max="500" maxlength="3">
            <template #label>
                Some field label
            </template>
            <template #information>
                Some info
            </template>
            <template #max-amount>
                This field cannot be higher than 500
            </template>
            <template #min-amount>
                This field needs to be at least 2
            </template>
            <template #required>
                This field is required
            </template>
        </number-field>
    </div>
</template>

<script lang="ts" setup>
import NumberField from '@/components/form/fields/input-field/number-field.vue';
import OneTimeCodeField from '@/components/form/fields/input-field/one-time-code-field.vue';
import { ValidatedFieldData } from '@/composables/types';
import { reactive } from 'vue';

const field = reactive([] as ValidatedFieldData[]);

const onUpdated = (data: ValidatedFieldData): void => {
    field[data.name] = data;
};
</script>

<style>
*,
*:before,
*:after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    display: flex;
    align-items: center;
    min-height: 50vh;
    justify-content: center;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #35495e;
    display: grid;
    grid-row-gap: 1em;
    width: 100%;
    max-width: 25em;
    padding: 1em;
}
</style>
