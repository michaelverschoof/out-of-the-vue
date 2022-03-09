<template>
    <label class="text-field input-field">

        <validatable-input :validations="validations" @updated="updated">
            <template #default="{ validate, error }">

                <debounceable-input :delay="typingDelay" @updated="(data) => parse(data, validate)">
                    <template #default="{ debounce }">

                        <header v-if="$slots.label" class="label">
                            <slot name="label" />
                        </header>

                        <main class="input" :class="{ focused, error }">
                            <prepend-append>
                                <template #prepend>
                                    <slot name="prepend" />
                                </template>

                                <user-input
                                    :name="name"
                                    :value="value"
                                    :allowed-characters="allowed"
                                    :allowed-character-format="format"
                                    @focused="$emit(EmitEvents.FOCUSED)"
                                    @blurred="$emit(EmitEvents.BLURRED)"
                                    @updated="debounce"
                                    @created="debounce"
                                />

                                <template #append>
                                    <slot name="append" />
                                </template>
                            </prepend-append>
                        </main>

                        <footer v-if="$slots.information && !error" class="information">
                            <slot name="information" />
                        </footer>

                    </template>
                </debounceable-input>
            </template>

            <template v-for="validation of validations" #[validation.name]>
                <slot :name="validation.name" />
            </template>
        </validatable-input>

    </label>
</template>

<script lang="ts" setup>
import PrependAppend from '@/components/form/fields/additions/layout/prepend-append.vue';
import DebounceableInput from '@/components/form/fields/base/debounceable-input.vue';
import UserInput from '@/components/form/fields/base/user-input.vue';
import ValidatableInput from '@/components/form/fields/base/validatable-input.vue';
import { EmitEvents } from '@/components/types';
import { FieldData, ValidatedFieldData, ValidationMethod } from '@/composables/types';
import { predefinedValidations } from '@/composables/validate-user-input';
import { computed, ref } from 'vue';

const emit = defineEmits<{ (event: EmitEvents.UPDATED, data: FieldData | ValidatedFieldData): void; }>();

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
    allowNegative: {
        type: Boolean,
        required: false,
        default: true
    },
    typingDelay: { // TODO rename to something better
        type: Number,
        required: false,
        default: null
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

const focused = ref(false);

const validations: ValidationMethod[] = [ // TODO Rename to something else
    { ...predefinedValidations['required'], parameters: [ props.required ] },
    { ...predefinedValidations['min-amount'], parameters: [ props.min ] },
    { ...predefinedValidations['max-amount'], parameters: [ props.max ] },
    ...props.customValidations
];

const allowed = '[0-9,.-]';
const format = computed(() => props.allowNegative ? '^-?[0-9]+[0-9,.]*$' : '^[0-9]+[0-9,.]*$');

const parse = (data: FieldData, validate: (data: FieldData) => void) => {
    console.log(data.value);

    // TODO parse number properly
    data.value = parseFloat(<string> data.value) || null;

    console.log(data.value);
    validate(data);
};

const updated = (data: ValidatedFieldData): void => {
    emit(EmitEvents.UPDATED, data);
};
</script>

<style lang="scss" scoped>
@use "./input-field";
</style>
