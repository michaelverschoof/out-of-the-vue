<template>
    <label class="one-time-code-field input-field" @paste.capture.prevent="filterPasteData">

        <validatable-input :validations="fieldValidations" @updated="fieldValidated">
            <template #default="{ validate: validateState, invalid: invalidState, showing, showValidity }">

                <header v-if="$slots.label" class="label">
                    <slot name="label" />
                </header>

                <main @blur.capture="fieldBlurred($event, showValidity)">
                    <template v-for="(n, index) of length">
                        <validatable-input :validations="inputValidations" @updated="(data) => { inputValidated(index, data); validateState(state) }">
                            <template #default="{ validate, invalid }">

                                <numeric-input
                                    class="input"
                                    maxlength="1"
                                    :class="{ invalid: invalid && showing }"
                                    :focusing="index === focusedElement"
                                    :name="`${name}-${index}`"
                                    :value="state.value[index]"
                                    :allow-decimals="false"
                                    :allow-negative="false"
                                    @updated="validate"
                                    @created="validate"
                                />

                            </template>
                        </validatable-input>
                    </template>
                </main>

                <footer v-if="$slots.information && !(invalidState && showing)" class="information">
                    <slot name="information" />
                </footer>

            </template>

            <template #required>
                <slot name="required" />
            </template>
        </validatable-input>

    </label>
</template>

<script lang="ts" setup>
import NumericInput from '@/components/form/fields/base/numeric-input.vue';
import ValidatableInput from '@/components/form/fields/base/validatable-input.vue';
import { OptionalProps, RequiredProps } from '@/components/props.types';
import { FieldData, ValidatedFieldData, ValidationMethod } from '@/composables/types';
import { useUserInput } from '@/composables/user-input';
import { predefinedValidations } from '@/composables/validate-user-input';
import { reactive, ref } from 'vue';

// TODO Add key handling
// TODO Add alpha and alphanumeric

const emit = defineEmits<{ (event: 'updated', data: ValidatedFieldData): void; }>();

const props = defineProps({
    name: RequiredProps.string,
    value: OptionalProps.number,
    focus: OptionalProps.boolean,
    required: OptionalProps.booleanFalse,
    validations: OptionalProps.validations,
    length: {
        type: Number,
        required: false,
        default: 6
    }
});

const state = reactive<ValidatedFieldData>({
    name: props.name,
    value: [],
    valid: !props.required,
    failed: []
});

const focusedElement = ref(props.focus ? 0 : null);

const inputValidated = (index: number, data: ValidatedFieldData): void => {
    state.value[index] = data.value;
    if (!data.valid) {
        return;
    }

    focusedElement.value = index + 1;
};

const fieldValidated = (data: ValidatedFieldData) => {
    state.valid = data.valid;
    state.failed = data.failed;

    const emitData: ValidatedFieldData = {
        name: state.name,
        value: Number((<number[]> state.value).join('')),
        valid: state.valid,
        failed: state.failed
    };

    emit('updated', emitData);
};

const fieldBlurred = (event: FocusEvent, showValidity: () => void) => {
    const currentTarget = event.currentTarget as HTMLElement;

    requestAnimationFrame(() => {
        if (currentTarget.contains(document.activeElement)) {
            return;
        }

        focusedElement.value = null;
        showValidity();
    });
};

const inputValidations: ValidationMethod[] = [
    { ...predefinedValidations['required'], parameters: [ props.required ] }
];

const fieldValidations: ValidationMethod[] = [
    {
        name: 'required',
        parameters: [ props.length ],
        validator: (data: FieldData, length: number) => {
            if (!data.value) {
                return false;
            }

            const value = <number[]> data.value;
            return value.length === length && value.every(val => val !== null);
        }
    }
];

const { filter } = useUserInput();
const filterPasteData = (event: ClipboardEvent): void => {
    const data = event.clipboardData?.getData('text');
    if (!data) {
        return;
    }

    // TODO improve
    const filtered = filter(data, new RegExp('[0-9]', 'g')).slice(0, props.length);
    const split = filtered.split('');
    for (let i = 0; i < props.length; i++) {
        state.value[i] = split[i] !== undefined ? Number(split[i]) : null;
    }
};
</script>

<style lang="scss" scoped>
@use "./input-field";

.one-time-code-field main input.input {
    font-size: 1.5em;
    height: 2.25em;
    text-align: center;
}
</style>
