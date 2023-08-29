<template>
    <label class="text-field input-field" v-bind="include($attrs, ['class', 'onClick'])">
        <debouncer :delay="typingDelay" @updated="validated">
            <template #default="{ debounce }">
                <validator :validations="validationMethods" :trigger-validation="triggerValidation" @created="initialized" @updated="debounce">
                    <template #default="{ initialize, validate, invalid, showing, showValidity }">
                        <header v-if="$slots.label" class="label">
                            <slot name="label" />
                        </header>

                        <main ref="main" class="input" :class="{ focused, invalid: invalid && showing }" tabindex="-1">
                            <prepend-append>
                                <template v-if="providedPrepend" #prepend>
                                    <slot name="prepend" />
                                </template>

                                <text-input
                                    v-bind="exclude($attrs, ['class', 'onClick'])"
                                    :name="name"
                                    :value="value"
                                    :allowed-characters="allowedCharacters"
                                    :max="maxLength"
                                    @blurred="fieldBlurred(showValidity)"
                                    @focused="focused = true"
                                    @created="initialize"
                                    @updated="validate"
                                />

                                <template v-if="providedAppend" #append>
                                    <slot name="append" />
                                </template>
                            </prepend-append>
                        </main>

                        <footer v-if="$slots.information && !(invalid && showing)" class="information">
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
import { provided } from '@/util/slots';
import { computed, nextTick, ref, useSlots } from 'vue';

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

const initialized = (data: FieldData | ValidatedFieldData): void => {
    emit('created', { ...(data as ValidatedFieldData) });
};

const validated = (data: FieldData | ValidatedFieldData): void => {
    emit('updated', { ...(data as ValidatedFieldData) });
};

const focused = ref<boolean>(false);
const main = ref<HTMLElement | null>(null);

const fieldBlurred = async (showValidity: () => void): Promise<void> => {
    focused.value = false;

    await nextTick();
    if (!main.value || main.value.contains(document.activeElement)) {
        return;
    }

    showValidity();
};

const slots = useSlots();
const providedPrepend = computed(() => provided(slots.prepend));
const providedAppend = computed(() => provided(slots.append));
</script>

<script lang="ts">
export default {
    inheritAttrs: false
};
</script>

<style lang="postcss" scoped>
@import '@/components/form/fields/input-field';
</style>
