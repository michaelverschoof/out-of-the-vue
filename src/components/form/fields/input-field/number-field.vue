<template>
    <label class="number-field input-field">

        <debounceable-input :delay="typingDelay" @updated="debounced">
            <template #default="{ debounce }">

                <validatable-input :validations="validations" :show-validations="!!state.immediate && !state.valid"
                                   @updated="(data) => updated(data, debounce)"
                >
                    <template #default="{ validate, error }">

                        <header v-if="$slots.label" class="label">
                            <slot name="label" />
                        </header>

                        <main class="input" :class="{ focused: focus, error: !!state.immediate && !state.valid }">
                            <prepend-append>
                                <template #prepend>
                                    <slot name="prepend" />
                                </template>

                                <numeric-input
                                    :name="name"
                                    :value="value"
                                    :allow-decimals="allowDecimals"
                                    :allow-negative="allowNegative"
                                    @focused="focused"
                                    @blurred="blurred"
                                    @updated="validate"
                                    @created="validate"
                                />

                                <template #append>
                                    <slot name="append" />
                                </template>
                            </prepend-append>
                        </main>

                        <footer v-if="$slots.information && !(!!state.immediate && !state.valid)" class="information">
                            <slot name="information" />
                        </footer>
                    </template>

                    <template v-for="validation of validations" #[validation.name]>
                        <slot :name="validation.name" />
                    </template>
                </validatable-input>

            </template>
        </debounceable-input>

    </label>
</template>

<script lang="ts" setup>
import PrependAppend from '@/components/form/fields/additions/layout/prepend-append.vue';
import DebounceableInput from '@/components/form/fields/base/debounceable-input.vue';
import NumericInput from '@/components/form/fields/base/numeric-input.vue';
import ValidatableInput from '@/components/form/fields/base/validatable-input.vue';
import { EmitEvents } from '@/components/types';
import { ValidatedFieldData, ValidationMethod } from '@/composables/types';
import { predefinedValidations } from '@/composables/validate-user-input';
import { reactive, ref } from 'vue';

const emit = defineEmits<{ (event: EmitEvents.UPDATED, data: ValidatedFieldData): void; }>();

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: false,
        default: null
    },
    typingDelay: { // TODO rename to something better
        type: Number,
        required: false,
        default: null
    },
    allowDecimals: {
        type: Boolean,
        required: false,
        default: true
    },
    allowNegative: {
        type: Boolean,
        required: false,
        default: true
    },
    required: { // TODO Move this and below to an importable file
        type: Boolean,
        required: false,
        default: false
    },
    min: {
        type: Number,
        required: false,
        default: null
    },
    max: {
        type: Number,
        required: false,
        default: null
    },
    customValidations: {
        type: Array as () => ValidationMethod[],
        required: false,
        default: []
    }
});

const focus = ref(false);

const validations: ValidationMethod[] = [ // TODO Rename to something else
    { ...predefinedValidations['required'], parameters: [ props.required ] },
    { ...predefinedValidations['min-amount'], parameters: [ props.min ] },
    { ...predefinedValidations['max-amount'], parameters: [ props.max ] },
    ...props.customValidations
];

const state = reactive({
    valid: true,
    immediate: false
});

const updated = (data: ValidatedFieldData, debounce: (data: ValidatedFieldData) => void): void => {
    state.valid = !!data.valid;

    if (state.valid) {
        state.immediate = false;
    }

    debounce(data);
};

const debounced = (data: ValidatedFieldData): void => {
    emit(EmitEvents.UPDATED, data);
};

const focused = (): void => {
    focus.value = true;
};

const blurred = (): void => {
    focus.value = false;
    state.immediate = !state.valid;
};
</script>

<style lang="scss" scoped>
@use "./input-field";
</style>
