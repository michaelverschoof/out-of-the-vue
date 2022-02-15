<template>
    <debounceable-user-input :delay="typingDelay" @updated="onUpdated">
        <template #default="{ debounce }">
            <validatable-user-input :validations="validations" :custom-validations="customValidations" @updated="debounce">
                <template #default="{ validate, error }">
                    <prepend-append :class="{ error }">
                        <template #prepend>
                            <slot name="prepend" />
                        </template>

                        <template #default="{ focus, blur }">
                            <user-input :name="name" @focused="focus" @blurred="blur" @updated="validate" @created="validate" />
                        </template>

                        <template #append>
                            <slot name="append" />
                        </template>
                    </prepend-append>

                    <label :for="name" class="information">
                        <slot name="information" />
                    </label>
                </template>

                <template v-if="!!maxLength" #max-length>
                    <slot name="max-length" />
                </template>
                <template v-if="!!minLength" #min-length>
                    <slot name="min-length" />
                </template>
                <template v-if="required" #required>
                    <slot name="required" />
                </template>
                <template v-if="!!customValidations?.length" v-for="validation of customValidations" v-slot:[validation.name]>
                    <slot :name="validation.name" />
                </template>
            </validatable-user-input>
        </template>
    </debounceable-user-input>
</template>

<script lang="ts" setup>
import UserInput from '@/components/form/fields/input/base/user-input.vue';
import PrependAppend from '@/components/form/fields/additions/layout/prepend-append.vue';
import ValidatableUserInput from '@/components/form/fields/input/base/validatable-user-input.vue';
import DebounceableUserInput from '@/components/form/fields/input/base/debounceable-user-input.vue';
import { BaseValidation, ValidatedFieldData, ValidationMethod } from '@/composables/types';
import { ref } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    typingDelay: {
        type: Number,
        required: false,
        default: null
    },
    required: {
        type: Boolean,
        required: false,
        default: false
    },
    minLength: {
        type: Number,
        required: false,
        default: null
    },
    maxLength: {
        type: Number,
        required: false,
        default: null
    },
    customValidations: {
        type: Object as () => ValidationMethod[],
        required: false,
        default: []
    }
});

const field = ref({} as ValidatedFieldData);

const onUpdated = (data: ValidatedFieldData): void => {
    field.value = data;
};

const validations: BaseValidation[] = [];

function setValidations() {
    const min = props.minLength;
    const max = props.maxLength;

    if (max && max > 0 && (!min || min < max)) {
        validations.push({
            name: 'min-length',
            parameter: max
        });
    }

    if (min && min > 0) {
        validations.push({
            name: 'min-length',
            parameter: min
        });
    }

    if (!!props.required) {
        validations.push({
            name: 'required'
        });
    }
}

setValidations();
</script>

<style scoped></style>
