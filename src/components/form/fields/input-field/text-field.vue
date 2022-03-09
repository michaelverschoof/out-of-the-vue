<template>
    <label class="text-field input-field">

        <debounceable-input :delay="typingDelay" @updated="updated">
            <template #default="{ debounce }">

                <validatable-input :validations="validations" @updated="debounce">
                    <template #default="{ validate, error }">

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
                                    :allowed-characters="allowedCharacters"
                                    @focused="focused = true"
                                    @blurred="focused = false"
                                    @updated="validate"
                                    @created="validate"
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
import UserInput from '@/components/form/fields/base/user-input.vue';
import ValidatableInput from '@/components/form/fields/base/validatable-input.vue';
import { EmitEvents } from '@/components/types';
import { FieldData, ValidatedFieldData, ValidationMethod } from '@/composables/types';
import { predefinedValidations } from '@/composables/validate-user-input';
import { ref } from 'vue';

const emit = defineEmits<{ (event: EmitEvents.UPDATED, data: FieldData | ValidatedFieldData): void; }>();

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: false,
        default: null
    },
    typingDelay: { // TODO rename to something better
        type: Number,
        required: false,
        default: null
    },
    allowedCharacters: {
        type: String,
        required: false,
        default: null
    },
    required: { // TODO Move this and below to an importable file
        type: Boolean,
        required: false,
        default: false
    },
    minLength: { // TODO rename to min and max?
        type: Number,
        required: false,
        default: null
    },
    maxLength: {
        type: Number,
        required: false,
        default: null
    },
    customValidations: { // TODO rename to validations?
        type: Array as () => ValidationMethod[],
        required: false,
        default: []
    }
});

const focused = ref(false);

const validations: ValidationMethod[] = [ // TODO Rename to something else
    { ...predefinedValidations['required'], parameters: [ props.required ] },
    { ...predefinedValidations['min-length'], parameters: [ props.minLength ] },
    { ...predefinedValidations['max-length'], parameters: [ props.maxLength ] },
    ...props.customValidations
];

const updated = (data: ValidatedFieldData): void => {
    emit(EmitEvents.UPDATED, data);
};
</script>

<style lang="scss" scoped>
@use "./input-field";
</style>
