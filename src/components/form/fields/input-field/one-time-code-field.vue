<template>
    <fieldset class="one-time-code-field input-field" @paste.prevent="filterPasteData">

        <validator :validations="fieldValidations" :trigger-validation="triggerValidation" @created="fieldInitialized" @updated="fieldValidated">
            <template #default="{ initialize: initializeState, validate: validateState, invalid: invalidState, showing, showValidity }">

                <header v-if="$slots.label" class="label">
                    <slot name="label" />
                </header>

                <main ref="main" tabindex="-1" @blur.prevent.capture="fieldBlurred(showValidity)">
                    <template v-for="(number, index) of length">

                        <one-time-code-field-item
                            :index="index"
                            :name="name"
                            :allowed-characters="allowedCharacters"
                            :focus="index === focusedElement"
                            :show-validation="showing"
                            :validations="inputValidations"
                            :value="state.value[index]"
                            @focused="focusedElement = index"
                            @created="initializeState({ ...state })"
                            @updated="(data) => { inputValidated(index, data); validateState({ ...state }) }"
                            @cleared="cleared(index)"
                        />

                    </template>
                </main>

                <footer v-if="$slots.information && !(invalidState && showing)" class="information">
                    <slot name="information" />
                </footer>

            </template>

            <template v-for="validation of fieldValidations" #[validation.name]>
                <slot :name="validation.name" />
            </template>
        </validator>

    </fieldset>
</template>

<script lang="ts" setup>
import OneTimeCodeFieldItem from '@/components/form/fields/input-field/one-time-code-field-item.vue';
import { FieldData, UpdateEmitType, ValidatedFieldData, ValidatedStringArrayFieldData, ValidatedStringFieldData, ValidationMethod, ValidationMethodParameters } from '@/composables/types';
import { predefinedValidations } from '@/composables/validate';
import Validator from '@/functionals/validator.vue';
import { filter, shorten, transform } from '@/util/strings';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const emit = defineEmits<{ (event: 'created' | 'updated', data: ValidatedFieldData): void; }>();

const props = withDefaults(
    defineProps<{
        name: string;
        focus?: boolean;
        required?: boolean;
        validations?: ValidationMethod[];
        triggerValidation?: string;
        type?: 'alpha' | 'numeric' | 'alphanumeric';
        length?: number;
    }>(),
    { type: 'alphanumeric', length: 6 }
);

const inputValidations: ValidationMethod[] = [
    { ...predefinedValidations['required'], parameters: [ props.required ] }
];

const fieldValidations: ValidationMethod[] = [
    {
        name: 'required',
        parameters: [ props.required, props.length ],
        validator: (data: FieldData, ...parameters: ValidationMethodParameters): boolean => {
            const required = <boolean> parameters[0];
            const length = <number> parameters[1];
            const value = <(string | null)[]> data.value;
            return !required || (!!value && value.length === length && value.every(val => val !== null));
        }
    },
    ...props.validations ?? []
];

const state = reactive<ValidatedStringArrayFieldData>({
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
const selectedIndex = ref<number | null>(props.focus ? 0 : -1);
const focusedElement = computed({
    get: (): number | null => selectedIndex.value ?? state.value.indexOf(null),
    set: (index: number | null) => {
        selectedIndex.value = index !== null && index < props.length ? index : null;
    }
});

watch(() => props.focus, (received?: boolean): void => {
    if (received) {
        return;
    }

    focusedElement.value = -1;
});

const inputValidated = (index: number, data: ValidatedStringFieldData): void => {
    state.value[index] = shorten(data.value, 1);
    if (!data.valid) {
        return;
    }

    focusedElement.value = index + 1;
};

const fieldInitialized = (data: ValidatedFieldData): void => {
    state.valid = data.valid;
    state.failed = data.failed;
};

const fieldValidated = (data: ValidatedFieldData): void => {
    state.valid = data.valid;
    state.failed = data.failed;

    updatedState('updated');
};

const main = ref<HTMLElement | null>(null);
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
        autoFocus();
        return;
    }

    convertValueForState(value);
    updatedState('updated');
};

const cleared = (index: number): void => {
    if (state.value[index] === null) {
        focusedElement.value = index - 1;
        return;
    }

    state.value[index] = null;
};

const allowedCharacters = `[${ props.type !== 'numeric' ? 'A-z' : '' }${ props.type !== 'alpha' ? '0-9' : '' }]`;
const regex = new RegExp(allowedCharacters, 'g');

function convertValueForState(value?: string): void {
    const stateValue = [ ...new Array(props.length) ];

    const filtered = filter(value, regex);
    if (!filtered) {
        state.value = stateValue.map(() => null);
        return autoFocus();
    }

    const transformed = transform(shorten(filtered, props.length), 'uppercase').split('');

    state.value = stateValue.map((item, index) => transformed[index] ?? null);
    autoFocus();
}

function updatedState(event: UpdateEmitType): void {
    const emitData: ValidatedFieldData = {
        name: state.name,
        value: state.value?.join('') || null,
        valid: state.valid,
        failed: state.failed
    };

    emit(event, emitData);
}

function autoFocus(): void {
    focusedElement.value = null;
}

onMounted(() => {
    convertValueForState();
    updatedState('created');
});
</script>

<style lang="scss" scoped>
@use "../input-field";

.one-time-code-field main {
    grid-template-columns: repeat(v-bind("props.length"), 1fr);
}
</style>
