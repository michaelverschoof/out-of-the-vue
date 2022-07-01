<template>
    <label class="number-field input-field" v-bind="include($attrs, ['class'])">

        <debouncer :delay="typingDelay" @updated="debounced">
            <template #default="{ debounce }">

                <validator :validations="validationMethods" :trigger-validation="triggerValidation" @created="initialized" @updated="debounce">
                    <template #default="{ initialize, validate, invalid, showing, showValidity }">

                        <header v-if="$slots.label" class="label">
                            <slot name="label" />
                        </header>

                        <main class="input" :class="{ focused, invalid: invalid && showing }">
                            <prepend-append>
                                <template #prepend>
                                    <slot name="prepend" />
                                </template>

                                <numeric-input
                                    v-bind="exclude($attrs, ['class', 'onCreated', 'onUpdated'])"
                                    :name="name"
                                    :value="value"
                                    :allow-decimals="allowDecimals"
                                    :allow-negative="allowNegative"
                                    @focused="focused = true"
                                    @blurred="focused = false; showValidity();"
                                    @created="initialize"
                                    @updated="validate"
                                />

                                <template #append>
                                    <slot name="append" />
                                </template>
                            </prepend-append>
                        </main>

                        <footer v-if="$slots.information && !(invalid && showing)" class="information">
                            <slot name="information" />
                        </footer>
                    </template>

                    <template v-for="validation of validationMethods" #[validation.name]>
                        <slot :name="validation.name" />
                    </template>
                </validator>

            </template>
        </debouncer>

    </label>
</template>

<script lang="ts" setup>
import NumericInput from '@/components/form/fields/base/numeric-input.vue';
import PrependAppend from '@/components/layout/prepend-append.vue';
import { FieldData, ValidatedFieldData, ValidatedNumberFieldData, ValidationMethod } from '@/composables/types';
import { predefinedValidations } from '@/composables/validate-user-input';
import Debouncer from '@/functionals/debouncer.vue';
import Validator from '@/functionals/validator.vue';
import { exclude, include } from '@/util/attrs';
import { ref } from 'vue';

const emit = defineEmits<{ (event: 'created' | 'updated', data: ValidatedFieldData): void; }>();

const props = withDefaults(
    defineProps<{
        name: string;
        value?: number;
        typingDelay?: number; // TODO rename to something better,
        allowDecimals?: boolean;
        allowNegative?: boolean;
        required?: boolean;
        min?: number;
        max?: number;
        validations?: ValidationMethod[];
        triggerValidation?: string;
    }>(),
    { allowDecimals: true, allowNegative: true }
);

const focused = ref<boolean>(false);

const validationMethods: ValidationMethod[] = [
    { ...predefinedValidations['required'], parameters: [ props.required ?? false ] },
    { ...predefinedValidations['min-amount'], parameters: [ props.min ] },
    { ...predefinedValidations['max-amount'], parameters: [ props.max ] },
    ...props.validations ?? []
];

const initialized = (data: FieldData | ValidatedFieldData): void => {
    emit('created', { ...data as ValidatedNumberFieldData });
};

const debounced = (data: FieldData | ValidatedFieldData): void => {
    emit('updated', { ...data as ValidatedNumberFieldData });
};
</script>

<script lang="ts">
export default {
    inheritAttrs: false
};
</script>

<style lang="scss" scoped>
@use "../input-field";
</style>
