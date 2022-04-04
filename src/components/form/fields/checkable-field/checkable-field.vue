<template>
    <fieldset class="checkable-field input-field">

        <validatable-input :validations="validationMethods" @created="initialized" @updated="validated">
            <template #default="{ initialize, validate, invalid, showing, showValidity }">

                <header v-if="$slots.label" class="label">
                    <slot name="label" />
                </header>

                <main ref="main" tabindex="-1" @blur.capture="fieldBlurred(showValidity)">
                    <template v-for="(item, key) of options" :key="key">

                        <label
                            class="checkable-field-item"
                            :class="{ selected: selectedItems.has(key), disabled: disabled.includes(key) }"
                        >
                            <checkable-input
                                :class="{ hidden: hideInput }"
                                :name="`checkable-input-${ name }`"
                                :value="key"
                                :type="type"
                                :checked="selected.includes(key)"
                                :disabled="disabled.includes(key)"
                                tabindex="0"
                                @created="(data) => { updated(data); initialize(state); }"
                                @updated="(data) => { updated(data); validate(state); }"
                            />

                            <span class="content">
                                <slot :name="key" />
                            </span>
                        </label>

                    </template>
                </main>

                <footer v-if="$slots.information && !(invalid && showing)" class="information">
                    <slot name="information" />
                </footer>

            </template>

            <template v-for="validation of validationMethods" #[validation.name]>
                <slot :name="validation.name" />
            </template>
        </validatable-input>

    </fieldset>
</template>

<script lang="ts" setup>
import CheckableInput from '@/components/form/fields/base/checkable-input.vue';
import ValidatableInput from '@/components/form/fields/base/validatable-input.vue';
import { OptionalProps, RequiredProps } from '@/components/props.types';
import { CheckableFieldData, UpdateEmitType, ValidatedFieldData, ValidationMethod } from '@/composables/types';
import { predefinedValidations } from '@/composables/validate-user-input';
import { filter } from '@/util/slots';
import { reactive, ref, useSlots } from 'vue';

const emit = defineEmits<{ (event: UpdateEmitType, data: ValidatedFieldData): void; }>();

const props = defineProps({
    name: RequiredProps.string,
    selected: OptionalProps.stringArray,
    disabled: OptionalProps.stringArray,
    required: OptionalProps.booleanFalse,
    min: OptionalProps.number,
    max: OptionalProps.number,
    validations: OptionalProps.validations,
    hideInput: OptionalProps.booleanFalse,
    type: {
        type: String as () => 'radio' | 'checkbox',
        required: true
    }
});

const validationMethods: ValidationMethod[] = [
    { ...predefinedValidations['required-array'], parameters: [ props.required ] },
    ...props.validations
];

if (props.type !== 'radio') {
    validationMethods.push(
        { ...predefinedValidations['min-array'], parameters: [ props.min ] },
        { ...predefinedValidations['max-array'], parameters: [ props.max ] }
    );
}

const options = filter(useSlots(), [ 'label', 'information', ...validationMethods.map(method => method.name) ]);

const selectedItems = ref<Set<string>>(new Set(props.selected));

const state = reactive<ValidatedFieldData>({
    name: props.name,
    value: Array.from(selectedItems.value),
    valid: !props.required,
    failed: []
});

const updated = (data: CheckableFieldData): void => {
    if (props.type === 'radio') {
        selectedItems.value.clear();
    }

    data.checked ? selectedItems.value.add(data.value) : selectedItems.value.delete(data.value);

    state.value = Array.from(selectedItems.value);
};

const initialized = (data: ValidatedFieldData): void => {
    state.valid = data.valid;
    state.failed = data.failed;

    emit('created', state);
};

const validated = (data: ValidatedFieldData): void => {
    state.valid = data.valid;
    state.failed = data.failed;

    emit('updated', state);
};

const main = ref<HTMLElement>(null);
const fieldBlurred = (showValidity: () => void) => {
    requestAnimationFrame(() => {
        if (main.value.contains(document.activeElement)) {
            return;
        }

        showValidity();
    });
};
</script>

<style lang="scss" scoped>
@use "../input-field";

.checkable-field-item {
    align-items: center;
    border-radius: 0.375em;
    cursor: pointer;
    display: flex;
    column-gap: 0.5em;
    min-height: 3.375em;
    padding: 0.5em 1em;

    &.selected {
        background: #f3f7f9;
    }

    &.disabled {
        cursor: not-allowed;
    }

    .hidden {
        display: none;
    }
}
</style>
