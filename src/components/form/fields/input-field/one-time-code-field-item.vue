<template>
    <validator :validations="validations" @created="(data) => emit('created', data)" @updated="(data) => emit('updated', data)">
        <template #default="{ initialize, validate, invalid }">

            <text-input
                class="input"
                transform-input="uppercase"
                :allowed-characters="allowedCharacters"
                :class="{ invalid: invalid && showValidation }"
                :focus="focus"
                :max="1"
                :name="`${name}-${index}`"
                :value="value"
                @focused="emit('focused')"
                @created="initialize"
                @updated="validate"
                @keydown.delete.prevent="emit('cleared')"
            />

        </template>
    </validator>
</template>

<script lang="ts" setup>
import TextInput from '@/components/form/fields/base/text-input.vue';
import { ValidatedFieldData, ValidationMethod } from '@/composables/types';
import Validator from '@/functionals/validator.vue';

const emit = defineEmits<{
    (event: 'created' | 'updated', data: ValidatedFieldData): void;
    (event: 'focused'): void;
    (event: 'cleared'): void;
}>();

const props = defineProps<{
    index: number;
    name: string;
    value?: string;
    focus?: boolean;
    validations?: ValidationMethod[];
    showValidation?: boolean;
    allowedCharacters?: string;
}>();
</script>

<style lang="scss" scoped>
input.input {
    font-size: 1.5em;
    height: 2.25em;
    text-align: center;
}
</style>
