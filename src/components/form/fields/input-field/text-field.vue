<template>
    <label class="text-field input-field" v-bind="include($attrs, ['class', 'onClick'])">
        <debouncer :delay="typingDelay" @updated="debounced">
            <template #default="{ debounce }">
                <validator
                    :validations="validationMethods"
                    :trigger-validation="triggerValidation"
                    :live-validation="!focused"
                    @created="initialized"
                    @updated="debounce"
                >
                    <template #default="{ initialize, validate, invalid, showing, showValidity }">
                        <header v-if="$slots.label" class="label" tabindex="-1">
                            <slot name="label" />
                        </header>

                        <main
                            ref="main"
                            tabindex="-1"
                            class="input"
                            :class="{ focused, invalid: invalid && showing }"
                            @blur.prevent.capture="fieldBlurred(showValidity)"
                        >
                            <prepend-append>
                                <template #prepend>
                                    <slot name="prepend" />
                                </template>

                                <text-input
                                    v-bind="exclude($attrs, ['class', 'onClick', 'onCreated', 'onUpdated'])"
                                    :name="name"
                                    :value="value"
                                    :allowed-characters="allowedCharacters"
                                    :max="maxLength"
                                    @focused="focused = true"
                                    @created="initialize"
                                    @updated="validate"
                                />

                                <template #append>
                                    <slot name="append" />
                                </template>
                            </prepend-append>
                        </main>

                        <footer v-if="$slots.information && !(invalid && showing)" ref="footer" class="information" tabindex="-1">
                            <slot name="information" />
                        </footer>
                    </template>

                    <template v-for="validation of validationMethods" #[validation.name]>
                        <slot :name="validation.name" />
                    </template>
                </validator>
            </template>
        </debouncer>
    </label>
</template>

<script lang="ts" setup>
import TextInput from '@/components/form/fields/base/text-input.vue';
import PrependAppend from '@/components/layout/prepend-append.vue';
import { FieldData, ValidatedFieldData, ValidationMethod } from '@/composables/types';
import { predefinedValidations } from '@/composables/validate';
import Debouncer from '@/functionals/debouncer.vue';
import Validator from '@/functionals/validator.vue';
import { exclude, include } from '@/util/attrs';
import { hasFocus } from '@/util/focus';
import { computed, ref } from 'vue';

const emit = defineEmits<{ (event: 'created' | 'updated', data: ValidatedFieldData): void }>();

const props = defineProps<{
    name: string;
    value?: string;
    typingDelay?: number;
    allowedCharacters?: string;
    maxLength?: number;
    max?: number;
    min?: number;
    required?: boolean;
    validations?: ValidationMethod[];
    triggerValidation?: string;
}>();

const validationMethods = computed<ValidationMethod[]>(() => [
    { ...predefinedValidations['required'], parameters: [props.required] },
    { ...predefinedValidations['min-length'], parameters: [props.min] },
    { ...predefinedValidations['max-length'], parameters: [props.max] },
    ...(props.validations ?? [])
]);

const focused = ref<boolean>(false);

const header = ref<HTMLElement | null>(null);
const main = ref<HTMLElement | null>(null);
const footer = ref<HTMLElement | null>(null);

const fieldBlurred = (showValidity: () => void): void => {
    requestAnimationFrame(() => {
        if (hasFocus(header, main, footer)) {
            return;
        }

        focused.value = false;
        showValidity();
    });
};

const initialized = (data: FieldData | ValidatedFieldData): void => {
    emit('created', { ...(data as ValidatedFieldData) });
};

const debounced = (data: FieldData | ValidatedFieldData): void => {
    emit('updated', { ...(data as ValidatedFieldData) });
};
</script>

<script lang="ts">
export default {
    inheritAttrs: false
};
</script>

<style lang="postcss" scoped>
@import '@/components/form/fields/input-field';
</style>
