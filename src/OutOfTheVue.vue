<template>
    <div>
        <text-field name="myTextField" :typing-delay="1000" required @updated="onUpdated" :min-length="2" :max-length="4" :custom-validations="custom">
            <template #label>
                Some field label
            </template>
            <template #prepend>
                prepend label
            </template>
            <template #append>
                append label
            </template>
            <template #information>
                Some info
            </template>
            <template #max-length>
                This field cannot be more than 5 characters long
            </template>
            <template #min-length>
                This field needs to be at least 2 characters long
            </template>
            <template #required>
                This field is required
            </template>
            <template #custom>
                This field is incorrect
            </template>
        </text-field>
    </div>

    <div>
        <number-field :typing-delay="1000" name="myNumberField" required @updated="onUpdated" :min="2" :max="500">
            <template #label>
                Some field label
            </template>
            <!--            <template #prepend>-->
            <!--                prepend label-->
            <!--            </template>-->
            <!--            <template #append>-->
            <!--                append label-->
            <!--            </template>-->
            <template #information>
                Some info
            </template>
            <template #max-amount>
                This field cannot be higher than 4
            </template>
            <template #min-amount>
                This field needs to be at least 2
            </template>
            <template #required>
                This field is required
            </template>
        </number-field>
    </div>

    <div>
        hi {{ field['myNumberField'] }}
    </div>
</template>

<script lang="ts" setup>
import NumberField from '@/components/form/fields/input-field/number-field.vue';
import TextField from '@/components/form/fields/input-field/text-field.vue';
import { ValidatedFieldData, ValidationMethod } from '@/composables/types';
import { reactive } from 'vue';

const field = reactive([] as ValidatedFieldData[]);

const onUpdated = (data: ValidatedFieldData): void => {
    // console.log(data);
    field[data.name] = data;
};

const custom: ValidationMethod[] = [
    {
        name: 'custom',
        validator: (data) => {
            return /^[0-9]*$/.test(<string> data.value);
        }
    }
];
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
}
</style>
