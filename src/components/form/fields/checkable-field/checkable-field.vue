<template>
    <fieldset class="checkable-field input-field">

        <validator :validations="validationMethods" :trigger-validation="triggerValidation" @created="initialized" @updated="validated">
            <template #default="{ initialize, validate, invalid, showing, showValidity }">

                <header v-if="$slots.label" class="label">
                    <slot name="label" />
                </header>

                <main ref="main" tabindex="-1" @blur.capture="fieldBlurred(showValidity)">
                    <template v-for="slot of slots" :key="slot">

                        <label v-if="!nonOptionSlots.includes(slot) && provided($slots[slot])"
                               :class="{ focused: focusedItems.has(slot), selected: state.value.includes(slot), disabled: disabled?.includes(slot) }"
                               class="checkable-field-item"
                        >
                            <checkable-input
                                :class="{ hidden: hideInput }"
                                :name="`checkable-input-${ name }`"
                                :value="slot"
                                :type="type"
                                :checked="state.value.includes(slot)"
                                :disabled="disabled?.includes(slot)"
                                tabindex="0"
                                @focused="focusItem(slot)"
                                @blurred="blurItem(slot)"
                                @created="(data) => { created(data); initialize(state); }"
                                @updated="(data) => { updated(data); validate(state); }"
                            />

                            <span class="content">
                                <slot :name="slot" :selected="state.value.includes(slot)" />
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
        </validator>

    </fieldset>
</template>

<script lang="ts" setup>
import CheckableInput from '@/components/form/fields/base/checkable-input.vue';
import { CheckableFieldData, ValidatedFieldData, ValidatedStringArrayFieldData, ValidationMethod } from '@/composables/types';
import { predefinedValidations } from '@/composables/validate';
import Validator from '@/functionals/validator.vue';
import { provided } from '@/util/slots';
import { onMounted, reactive, ref, useSlots, watch } from 'vue';

const emit = defineEmits<{ (event: 'created' | 'updated', data: ValidatedFieldData): void; }>();

const props = defineProps<{
    type: 'radio' | 'checkbox';
    name: string;
    selected?: string[];
    disabled?: string[];
    required?: boolean;
    min?: number;
    max?: number;
    validations?: ValidationMethod[];
    triggerValidation?: string;
    hideInput?: boolean;
}>();

const validationMethods: ValidationMethod[] = [
    { ...predefinedValidations['required-array'], parameters: [ props.required ] },
    ...props.validations ?? []
];

if (props.type !== 'radio') {
    validationMethods.push(
        { ...predefinedValidations['min-array'], parameters: [ props.min ] },
        { ...predefinedValidations['max-array'], parameters: [ props.max ] }
    );
}

const slots = Object.keys(useSlots());
const nonOptionSlots = [ 'label', 'information', ...validationMethods.map(method => method.name) ];

const selectedItems = ref<Set<string>>(new Set(filterSelected(props.selected)));
const focusedItems = ref<Set<string>>(new Set());

const state = reactive<ValidatedStringArrayFieldData>({
    name: props.name,
    value: Array.from(selectedItems.value),
    valid: !props.required,
    failed: []
});

watch(() => props.selected, (received?: string[]) => {
    const filtered = filterSelected(received);
    if (JSON.stringify(filtered) === JSON.stringify(state.value)) {
        return;
    }

    selectedItems.value = new Set<string>(filtered);
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

const main = ref<HTMLElement | null>(null);
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

function filterSelected(selected?: (string | null)[]): string[] {
    return (selected || []).filter(item => item !== null) as string[];
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

    .content {
        flex-grow: 1;
    }
}
</style>
