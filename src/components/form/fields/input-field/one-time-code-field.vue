<template>
    <fieldset class="one-time-code-field input-field" @paste.prevent="filterPasteData">

        <validatable-input :validations="fieldValidations" :trigger-validation="triggerValidation" @created="fieldInitialized" @updated="fieldValidated">
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
                            :value="state.value[index] ?? undefined"
                            @focused="focusedElement = index"
                            @created="initializeState(toRaw(state))"
                            @updated="(data) => { inputValidated(index, data); validateState(toRaw(state)) }"
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
        </validatable-input>

    </fieldset>
</template>

<script lang="ts" setup>
import ValidatableInput from '@/components/form/fields/base/validatable-input.vue';
import OneTimeCodeFieldItem from '@/components/form/fields/input-field/one-time-code-field-item.vue';
import { FieldData, UpdateEmitType, ValidatedFieldData, ValidatedStringArrayFieldData, ValidationMethod, ValidationMethodParameters } from '@/composables/types';
import { useUserInput } from '@/composables/user-input';
import { predefinedValidations } from '@/composables/validate-user-input';
import { computed, onMounted, reactive, ref, toRaw, watch } from 'vue';

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
            const required = parameters[0] as boolean;
            const length = parameters[1] as number;
            const value = <(string | number | null)[]> data.value;
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

const inputValidated = (index: number, data: ValidatedFieldData): void => {
    state.value[index] = (<string> data.value)?.slice(0, 1) ?? null;
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

const { filter } = useUserInput();
const allowedCharacters = `[${ props.type !== 'numeric' ? 'A-z' : '' }${ props.type !== 'alpha' ? '0-9' : '' }]`;
const regex = new RegExp(allowedCharacters, 'g');

function convertValueForState(value?: string): void {
    const stateValue = [ ...new Array(props.length) ];
    // if (!value) {
    //     state.value = stateValue.map(() => null);
    //     console.log(state.value);
    //     return;
    // }

    const filtered = filter(value ?? '', regex)?.toUpperCase().slice(0, props.length).split('') ?? [];
    state.value = stateValue.map((item, index) => filtered[index] ?? null);

    autoFocus();
}

function updatedState(event: UpdateEmitType): void {
    const value = state.value.join('');

    let emitValue: string | number | null = !!value ? value : null;
    if (props.type === 'numeric' && emitValue !== null) {
        emitValue = Number(emitValue);
    }

    const emitData: ValidatedFieldData = {
        name: state.name,
        value: emitValue as string | number,
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
