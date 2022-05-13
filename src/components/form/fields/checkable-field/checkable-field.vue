<template>
    <fieldset class="checkable-field input-field">

        <validatable-input :validations="validationMethods" :trigger-validation="triggerValidation" @created="initialized" @updated="validated">
            <template #default="{ initialize, validate, invalid, showing, showValidity }">

                <header v-if="$slots.label" class="label">
                    <slot name="label" />
                </header>

                <main ref="main" tabindex="-1" @blur.capture="fieldBlurred(showValidity)">
                    <template v-for="(item, key) of $slots" :key="key">

                        <label v-if="!nonOptionSlots.includes(key)"
                               :class="{ focused: focusedItems.has(key), selected: state.value.includes(key), disabled: disabled.includes(key) }"
                               class="checkable-field-item"
                        >
                            <checkable-input
                                :class="{ hidden: hideInput }"
                                :name="`checkable-input-${ name }`"
                                :value="key"
                                :type="type"
                                :checked="state.value.includes(key)"
                                :disabled="disabled.includes(key)"
                                tabindex="0"
                                @focused="focusItem(key)"
                                @blurred="blurItem(key)"
                                @created="(data) => { created(data); initialize(state); }"
                                @updated="(data) => { updated(data); validate(state); }"
                            />

                            <span class="content">
                                <slot :name="key" :selected="state.value.includes(key)" />
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
import { onMounted, reactive, ref, watch } from 'vue';

const emit = defineEmits<{ (event: UpdateEmitType, data: ValidatedFieldData): void; }>();

const props = defineProps({
    name: RequiredProps.string,
    selected: OptionalProps.stringArray,
    disabled: OptionalProps.stringArray,
    required: OptionalProps.booleanFalse,
    min: OptionalProps.number,
    max: OptionalProps.number,
    validations: OptionalProps.validations,
    triggerValidation: OptionalProps.string,
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

const nonOptionSlots = [ 'label', 'information', ...validationMethods.map(method => method.name) ];

const selectedItems = ref<Set<string>>(new Set(filterSelected(props.selected)));
const focusedItems = ref<Set<string>>(new Set());

const state = reactive<ValidatedFieldData>({
    name: props.name,
    value: Array.from(selectedItems.value),
    valid: !props.required,
    failed: []
});

watch(() => props.selected, (received: string[]) => {
    const filtered = filterSelected(received);
    if (JSON.stringify(filtered) === JSON.stringify(state.value)) {
        return;
    }

    selectedItems.value = new Set(filtered);
    state.value = Array.from(selectedItems.value);
});

const created = (data: CheckableFieldData): void => {
    if (props.type === 'radio' && !data.checked) {
        return;
    }

    updated(data);
};

const updated = (data: CheckableFieldData): void => {
    if (props.type === 'radio' && data.checked) {
        selectedItems.value.clear();
    }

    data.checked ? selectedItems.value.add(data.value) : selectedItems.value.delete(data.value);
    state.value = Array.from(selectedItems.value);
};

const initialized = (data: ValidatedFieldData): void => {
    state.valid = data.valid;
    state.failed = data.failed;
};

const validated = (data: ValidatedFieldData): void => {
    state.valid = data.valid;
    state.failed = data.failed;

    emit('updated', { ...state });
};

const focusItem = (item: string): void => {
    focusedItems.value.add(item);
};

const blurItem = (item: string): void => {
    focusedItems.value.delete(item);
};

const main = ref<HTMLElement>(null);
const fieldBlurred = (showValidity: () => void): void => {
    requestAnimationFrame(() => {
        if (!main.value || main.value.contains(document.activeElement)) {
            return;
        }

        showValidity();
    });
};

onMounted(() => {
    emit('created', { ...state });
});

function filterSelected(selected: string[]): string[] {
    return (selected || []).filter(item => item !== null && item !== undefined);
}
</script>

<style lang="scss" scoped>
@use "../input-field";

.checkable-field-item {
    align-items: center;
    cursor: pointer;
    display: flex;
    column-gap: 1em;
    min-height: 3.375em;

    &.disabled {
        cursor: not-allowed;
    }

    .hidden {
        display: none;
    }
}
</style>
