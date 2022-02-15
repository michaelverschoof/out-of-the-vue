<template>
    <img alt="Vue logo" src="./assets/logo.png" />

    <div>
        <debounceable-user-input @updated="onUpdated">
            <template #default="{ debounce }">
                <validatable-user-input :validations="validations" :custom-validations="custom" @updated="debounce">
                    <template #default="{ validate, error }">
                        <prepend-append :class="{ error }">
                            <template #prepend>
                                <label for="test2">prepend label</label>
                            </template>

                            <template #default="{ focus, blur }">
                                <user-input name="test2" @focused="focus" @blurred="blur" @updated="validate" @created="validate" />
                            </template>

                            <template #append>
                                <label for="test2">append label</label>
                            </template>
                        </prepend-append>

                        <label for="test2" class="information">
                            <message>Hello world</message>
                            <counter :limit="5" :current="field.value" />
                        </label>
                    </template>

                    <template #max-length>
                        <label for="test2">This field cannot be more than 5 characters long</label>
                    </template>
                    <template #min-length>
                        <label for="test2">This field needs to be at least 2 characters long</label>
                    </template>
                    <template #required>
                        <label for="test2">This field is required</label>
                    </template>
                    <template #custom>
                        <label for="test2">This field is incorrect</label>
                    </template>
                </validatable-user-input>
            </template>
        </debounceable-user-input>
    </div>

    <div>
        <text-field name="myTextField"></text-field>
    </div>
</template>

<script lang="ts" setup>
import PrependAppend from '@/components/form/fields/additions/layout/prepend-append.vue';
import Counter from '@/components/form/fields/additions/counter.vue';
import Message from '@/components/form/fields/additions/message.vue';
import TextField from '@/components/form/fields/input/text-field.vue';
import UserInput from '@/components/form/fields/input/base/user-input.vue';
import ValidatableUserInput from '@/components/form/fields/input/base/validatable-user-input.vue';
import { BaseValidation, ValidatedFieldData, ValidationMethod } from '@/composables/types';
import DebounceableUserInput from '@/components/form/fields/input/base/debounceable-user-input.vue';
import { ref } from 'vue';

const field = ref({} as ValidatedFieldData);

const onUpdated = (data: ValidatedFieldData): void => {
    field.value = data;
};

const validations: BaseValidation[] = [
    {
        name: 'required'
    },
    {
        name: 'min-length',
        parameter: 2
    },
    {
        name: 'max-length',
        parameter: 5
    }
];

const custom: ValidationMethod[] = [
    {
        name: 'custom',
        validator: (data) => {
            return /^[0-9]*$/.test(data.value);
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
    justify-content: center;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #35495e;
    padding-top: 5em;
    display: grid;
    grid-row-gap: 1em;
    width: 100%;
    max-width: 50em;
}

.information {
    display: flex;
    justify-content: space-between;
    padding-top: 0.25em;
}
</style>
