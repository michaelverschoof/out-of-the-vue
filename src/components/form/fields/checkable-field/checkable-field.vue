<template>
    <fieldset class="checkable-field input-field">
        <validator :validations="validationMethods" :trigger-validation="triggerValidation" @created="initialized" @updated="validated">
            <template #default="{ initialize, validate, invalid, showing, showValidity }">
                <header v-if="provided(slots.label)" class="label">
                    <slot name="label" />
                </header>

                <main ref="main" tabindex="-1" @blur.capture="fieldBlurred(showValidity)">
                    <template v-for="key of keys" :key="key">
                        <label
                            v-if="!nonOptionSlots.includes(key) && provided(slots[key])"
                            class="checkable-field-item"
                            tabindex="0"
                            :aria-checked="state.value.includes(key)"
                            :class="{ focused: focusedItems.has(key), selected: state.value.includes(key), disabled: disabled?.includes(key) }"
                            :role="type"
                            @keypress.space.enter="
                                () => {
                                    select(key);
                                    validate(state);
                                }
                            "
                        >
                            <checkable-input
                                :class="{ hidden: hideInput }"
                                :name="`checkable-input-${name}`"
                                :value="key"
                                :type="type"
                                :checked="state.value.includes(key)"
                                :disabled="disabled?.includes(key)"
                                tabindex="-1"
                                @focused="focusItem(key)"
                                @blurred="blurItem(key)"
                                @created="
                                    (data) => {
                                        created(data);
                                        initialize(state);
                                    }
                                "
                                @updated="
                                    (data) => {
                                        updated(data);
                                        validate(state);
                                    }
                                "
                            />

                            <span class="content">
                                <slot :name="key" :selected="state.value.includes(key)" />
                            </span>
                        </label>
                    </template>
                </main>

                <footer v-if="provided(slots.information) && !(invalid && showing)" class="information">
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
import { computed, onMounted, reactive, ref, useSlots, watch } from 'vue';

const emit = defineEmits<{ (event: 'created' | 'updated', data: ValidatedFieldData): void }>();

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

const validationMethods = computed<ValidationMethod[]>(() => {
    const validations = [{ ...predefinedValidations['required-array'], parameters: [props.required] }, ...(props.validations ?? [])];

    if (props.type !== 'radio') {
        validations.push(
            { ...predefinedValidations['min-array'], parameters: [props.min] },
            { ...predefinedValidations['max-array'], parameters: [props.max] }
        );
    }

    return validations;
});

const slots = useSlots();
const keys = Object.keys(slots);

const nonOptionSlots = ['label', 'information', ...validationMethods.value.map((method) => method.name)];

const selectedItems = ref<Set<string>>(new Set(filterSelected(props.selected)));
const focusedItems = ref<Set<string>>(new Set());

const state = reactive<ValidatedStringArrayFieldData>({
    name: props.name,
    value: Array.from(selectedItems.value),
    valid: !props.required,
    failed: []
});

watch(
    () => props.selected,
    (received?: string[]) => {
        const filtered = filterSelected(received);
        if (JSON.stringify(filtered) === JSON.stringify(state.value)) {
            return;
        }

        selectedItems.value = new Set<string>(filtered);
        state.value = Array.from(selectedItems.value);
    }
);

const created = (data: CheckableFieldData): void => {
    if (props.type === 'radio' && !data.checked) {
        return;
    }

    updated(data, 'created');
};

const updated = (data: CheckableFieldData, event: 'created' | 'updated' = 'updated'): void => {
    if (props.type === 'radio') {
        if (selectedItems.value.has(data.value)) {
            return event !== 'created' ? emit(event, { ...state }) : null;
        }

        if (data.checked) {
            selectedItems.value.clear();
        }
    }

    data.checked ? selectedItems.value.add(data.value) : selectedItems.value.delete(data.value);
    state.value = Array.from(selectedItems.value);
};

const select = (key: string) => {
    if (!!props.disabled && props.disabled.includes(key)) {
        return;
    }

    const data: CheckableFieldData = {
        name: state.name,
        value: key,
        checked: !selectedItems.value.has(key)
    };

    updated(data);
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
    return (selected || []).filter((item) => item !== null) as string[];
}
</script>

<style lang="postcss" scoped>
@import '@/components/form/fields/input-field';

.checkable-field main {
    display: grid;
    column-gap: 0.5em;
    row-gap: 0.5em;

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
}
</style>
