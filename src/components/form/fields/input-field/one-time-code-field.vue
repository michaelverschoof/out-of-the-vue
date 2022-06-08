<template>
    <fieldset class="one-time-code-field input-field" @paste.capture.prevent="filterPasteData">

        <validatable-input :validations="fieldValidations" :trigger-validation="triggerValidation" @updated="fieldValidated">
            <template #default="{ validate: validateState, invalid: invalidState, showing, showValidity }">

                <header v-if="$slots.label" class="label">
                    <slot name="label" />
                </header>

                <main ref="main" tabindex="-1" @blur.capture="fieldBlurred(showValidity)">
                    <template v-for="(number, index) of length">

                        <validatable-input :validations="inputValidations"
                                           @created="validateState(state)"
                                           @updated="(data) => { inputValidated(index, data); validateState(state) }"
                        >
                            <template #default="{ initialize, validate, invalid }">

                                <text-input
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
                                    @created="initialize"
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

            <template v-for="validation of fieldValidations" #[validation.name]>
                <slot :name="validation.name" />
            </template>
        </validatable-input>

    </fieldset>
</template>

<script lang="ts" setup>
import TextInput from '@/components/form/fields/base/text-input.vue';
import ValidatableInput from '@/components/form/fields/base/validatable-input.vue';
import { OptionalProps, RequiredProps } from '@/components/props.types';
import { FieldData, UpdateEmitType, ValidatedFieldData, ValidationMethod } from '@/composables/types';
import { useUserInput } from '@/composables/user-input';
import { predefinedValidations } from '@/composables/validate-user-input';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const emit = defineEmits<{ (event: UpdateEmitType, data: ValidatedFieldData): void; }>();

const props = defineProps({
    name: RequiredProps.string,
    focus: OptionalProps.boolean,
    required: OptionalProps.booleanFalse,
    validations: OptionalProps.validations,
    triggerValidation: OptionalProps.string,
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
    {
        name: 'required',
        parameters: [ props.required, props.length ],
        validator: (data: FieldData, required: boolean, length: number): boolean => {
            const value = <(string | number)[]> data.value;
            return !required || (!!value && value.length === length && value.every(val => val !== null));
        }
    },
    ...props.validations
];

const allowedCharacters = `[${ props.type !== 'numeric' ? 'A-z' : '' }${ props.type !== 'alpha' ? '0-9' : '' }]`;

const state = reactive<ValidatedFieldData>({
    name: props.name,
    value: [],
    valid: !props.required,
    failed: props.required ? [ 'required' ] : []
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

watch(() => props.focus, (received: boolean): void => {
    if (!received) {
        focusedElement.value = -1;
        return;
    }

    if (selectedIndex.value !== null && selectedIndex.value !== -1) {
        return;
    }

    focusedElement.value = (<string[]> state.value).indexOf(null);
});

const inputValidated = (index: number, data: ValidatedFieldData): void => {
    state.value[index] = (<string> data.value)?.slice(0, 1) ?? null;
    if (!data.valid) {
        return;
    }

    focusedElement.value = index + 1;
};

const fieldValidated = (data: ValidatedFieldData): void => {
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

const main = ref<HTMLElement>(null);
const fieldBlurred = (showValidity: () => void): void => {
    requestAnimationFrame(() => {
        if (!main.value || main.value.contains(document.activeElement)) {
            return;
        }

        focusedElement.value = -1;
        showValidity();
    });
};

const filterPasteData = (event: ClipboardEvent): void => {
    const value = event.clipboardData?.getData('text');
    if (!value) {
        return;
    }

    convertValueForState(value);
};

const { filter } = useUserInput();
const regex = new RegExp(allowedCharacters, 'g');

function convertValueForState(value?: string): void {
    const stateValue = [ ...new Array(props.length) ];
    if (!value) {
        state.value = stateValue.map(() => null);
        return;
    }

    const filtered = filter(value, regex).toUpperCase().slice(0, props.length).split('');
    state.value = stateValue.map((item, index) => filtered[index] ?? null);

    focusedElement.value = null;
}

const clearInput = (index: number): void => {
    if (state.value[index] === null) {
        focusedElement.value = index - 1;
        return;
    }

    state.value[index] = null;
};

onMounted(() => {
    convertValueForState();
    emit('created', { ...state });
});
</script>

<style lang="scss" scoped>
@use "../input-field";

.one-time-code-field {

    main {
        grid-template-columns: repeat(v-bind("props.length"), 1fr);

        input.input {
            font-size: 1.5em;
            height: 2.25em;
            text-align: center;
        }
    }
}
</style>
