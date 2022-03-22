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

                                <user-input
                                    class="input"
                                    maxlength="1"
                                    transform-input="uppercase"
                                    :allowed-characters="allowedCharacters"
                                    :class="{ invalid: invalid && showing }"
                                    :focus="index === focusedElement"
                                    :name="`${name}-${index}`"
                                    :value="state.value[index]"
                                    @keydown.delete.prevent="clearInput(index)"
                                    @focused="focusedElement = index"
                                    @created="validate"
                                    @updated="validate"
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
import UserInput from '@/components/form/fields/base/user-input.vue';
import ValidatableInput from '@/components/form/fields/base/validatable-input.vue';
import { OptionalProps, RequiredProps } from '@/components/props.types';
import { ValidatedFieldData, ValidationMethod } from '@/composables/types';
import { useUserInput } from '@/composables/user-input';
import { predefinedValidations } from '@/composables/validate-user-input';
import { computed, reactive, ref, watch } from 'vue';

const emit = defineEmits<{ (event: 'updated', data: ValidatedFieldData): void; }>();

const props = defineProps({
    name: RequiredProps.string,
    value: OptionalProps.string,
    focus: OptionalProps.boolean,
    required: OptionalProps.booleanFalse,
    validations: OptionalProps.validations,
    type: {
        type: String as () => 'alpha' | 'numeric' | 'alphanumeric',
        required: false,
        default: 'alphanumeric'
    },
    length: {
        type: Number,
        required: false,
        default: 6
    }
});

const inputValidations: ValidationMethod[] = [
    { ...predefinedValidations['required'], parameters: [ props.required ] }
];

const fieldValidations: ValidationMethod[] = [
    { ...predefinedValidations['required-array'], parameters: [ props.required, props.length ] }
];

const allowedCharacters = `[${ props.type !== 'numeric' ? 'A-z' : '' }${ props.type !== 'alpha' ? '0-9' : '' }]`;

const state = reactive<ValidatedFieldData>({
    name: props.name,
    value: [],
    valid: !props.required,
    failed: []
});

/**
 * The selected index determines which input field is focused
 * When setting the value to null, the focused item will be determined by the first null value in the list
 * When setting the value to -1, no element will be focused
 */
const selectedIndex = ref(props.focus ? 0 : -1);
const focusedElement = computed({
    get: () => selectedIndex.value ?? (<string[]> state.value).indexOf(null),
    set: (index: number) => {
        selectedIndex.value = index < props.length ? index : null;
    }
});

const inputValidated = (index: number, data: ValidatedFieldData): void => {
    state.value[index] = data.value;
    if (!data.valid) {
        return;
    }

    focusedElement.value = null;
};

const fieldValidated = (data: ValidatedFieldData) => {
    state.valid = data.valid;
    state.failed = data.failed;

    let emitValue: string | number = (<string[]> state.value).join('');
    if (props.type === 'numeric') {
        emitValue = Number(emitValue);
    }

    const emitData: ValidatedFieldData = {
        name: state.name,
        value: emitValue,
        valid: state.valid,
        failed: state.failed
    };

    emit('updated', emitData);
};

const fieldBlurred = (event: FocusEvent, showValidity: () => void) => {
    const currentTarget = <HTMLElement> event.currentTarget;

    requestAnimationFrame(() => {
        if (currentTarget.contains(document.activeElement)) {
            return;
        }

        focusedElement.value = -1;
        showValidity();
    });
};

watch(() => props.value, (received: string) => {
    convertValueForState(received);
});

const filterPasteData = (event: ClipboardEvent): void => {
    const value = event.clipboardData?.getData('text');
    if (!value) {
        return;
    }

    convertValueForState(value);
};

const { filter } = useUserInput();
const regex = new RegExp(allowedCharacters, 'g');

function convertValueForState(value: string) {
    const stateValue = [ ...new Array(props.length) ];
    if (!value) {
        state.value = stateValue.map(item => null);
        return;
    }

    const filtered = filter(value, regex).slice(0, props.length).split('');
    state.value = stateValue.map((item, index) => filtered[index] ?? null);

    focusedElement.value = null;
}

const clearInput = (index: number) => {
    state.value[index] = null;
    if (index === 0) {
        return;
    }

    focusedElement.value = index - 1;
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
