<template>
    <story title="Components/Form/Fields/Checkable field" :layout="{ type: 'grid', width: 400 }" auto-props-disabled>
        <!-- type: 'radio' | 'checkbox';
        name: string;
        selected?: string[];
        disabled?: string[];
        required?: boolean;
        min?: number;
        max?: number;
        validations?: ValidationMethod[];
        triggerValidation?: string;
        hideInput?: boolean; -->

        <variant title="Simple">
            <checkable-field
                name="histoire-checkable-field-simple"
                :type="state.type"
                :hide-input="state.hideInput"
                :selected="state.selected"
                :disabled="state.disabled"
                @created="logEvent('created', $event)"
                @updated="update"
            >
                <template v-for="item of items" #[item.value]>
                    {{ item.label }}
                </template>
            </checkable-field>
        </variant>

        <variant title="With label and information">
            <checkable-field
                name="histoire-checkable-field-labels"
                :type="state.type"
                :hide-input="state.hideInput"
                :selected="state.selected"
                :disabled="state.disabled"
                @created="logEvent('created', $event)"
                @updated="update"
            >
                <template v-for="item of items" #[item.value]>
                    {{ item.label }}
                </template>
                <template #label>Field label</template>
                <template #information><i>Helpful text on how to fill in the field</i></template>
            </checkable-field>
        </variant>

        <variant title="With inner icons">
            <checkable-field
                name="histoire-checkable-field-inner-icons"
                hide-input
                :type="state.type"
                :selected="state.selected"
                :disabled="state.disabled"
                @created="logEvent('created', $event)"
                @updated="update"
            >
                <template v-for="item of items" #[item.value]>
                    <prepend-append :key="item.value">
                        <template #prepend>
                            <icon icon="mdi:airballoon" />
                        </template>
                        {{ item.label }}
                    </prepend-append>
                </template>
            </checkable-field>
        </variant>

        <template #controls>
            <show-grid-lines show />

            <hst-button-group v-model="state.type" title="Input type" :options="['radio', 'checkbox']" />
            <hst-radio v-if="'radio' === state.type" v-model="state.selected[0]" title="Selected" :options="items" />
            <hst-checkbox-list v-else v-model="state.selected" title="Selected" :options="items" />
            <hst-checkbox v-model="state.hideInput" title="Hide input" />
        </template>
    </story>
</template>

<script lang="ts" setup>
import CheckableField from '@/components/form/fields/checkable-field/checkable-field.vue';
import PrependAppend from '@/components/layout/prepend-append.vue';
import { Icon } from '@iconify/vue';
import ShowGridLines from '@test/components/show-grid-lines.vue';
import { logEvent } from 'histoire/client';
import { reactive, watch } from 'vue';

const items = [
    { value: 'one', label: 'First item' },
    { value: 'two', label: 'Second item' },
    { value: 'three', label: 'Third item' }
];

const state = reactive({
    type: 'radio' as 'radio' | 'checkbox',
    selected: [items[0].value],
    disabled: [items[2].value],
    hideInput: false
});

watch(
    () => state.type,
    () => {
        if (state.type !== 'radio') {
            return;
        }
        state.selected = [state.selected[0]];
    }
);

const update = (event: any) => {
    state.selected = event.value;
    logEvent('updated', event);
};
</script>

<style lang="postcss" scoped>
.checkable-field {
    :deep(.checkable-field-item) {
        transition: background-color 200ms;
        &.selected {
            @apply bg-cyan-900;
        }

        &.disabled {
            @apply text-gray-400;
        }
    }

    .prepend-append {
        gap: 1rem;
    }
}
</style>

<docs lang="md">
# Text field

The checkable field provides a structured way of building form fields.

This field allows you to build selectors using your own templating with HTML and CSS. You can choose to show or hide the input and add any HTML as items.

In this example a `<prepend-append>` element is used where an icon is shown, creating a custom select box.
</docs>
