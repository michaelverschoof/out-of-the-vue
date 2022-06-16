<template>
    <div>
        <text-field name="fff" foo="bar" required @updated="onUpdated" class="ff">
            <template #label>test</template>

            <template #append>test</template>
        </text-field>
    </div>

    <div>
        <one-time-code-field name="myOneTimeCode" required @updated="onUpdated">
            <template #label>
                Some field label
            </template>
            <template #information>
                Some info
            </template>
            <template #required>
                This field is required
            </template>
        </one-time-code-field>
    </div>

    <div>
        <number-field :typing-delay="1000" name="myNumberField" required @updated="onUpdated" :min="2" :max="500" maxlength="3">
            <template #label>
                Some field label
            </template>
            <template #information>
                Some info
            </template>
            <template #max>
                This field cannot be higher than 500
            </template>
            <template #min>
                This field needs to be at least 2
            </template>
            <template #required>
                This field is required
            </template>
        </number-field>
    </div>

    <button @click="toggle">trigger</button>
    <div>
        <checkable-field name="test" type="checkbox" class="foo" required :min="2" :max="2" :selected="['ddd']">
            <template #label>
                Some field label
            </template>
            <template #information>
                Some info
            </template>

            <template v-for="item of items" #[item]>
                {{ item }}
            </template>

            <template #required>This field is required</template>
            <template #min>Not enough</template>
            <template #max>Too many</template>
        </checkable-field>
    </div>

    <modal :open="modalOpened" @closed="modalOpened = null;" class="foo">
        <template #opener="{ open }">
            <button @click="open">open modal</button>
        </template>

        <template #header>
            Some header stuff
        </template>

        <template #default="{ close }">
            <div>
                ff
            </div>
        </template>

        <template #footer>
            Some footer stuff
        </template>
    </modal>

    <button type="button" @click="modalOpened = 1;">set modal's opened to 1</button>
</template>

<script lang="ts" setup>
import CheckableField from '@/components/form/fields/checkable-field/checkable-field.vue';
import NumberField from '@/components/form/fields/input-field/number-field.vue';
import OneTimeCodeField from '@/components/form/fields/input-field/one-time-code-field.vue';
import TextField from '@/components/form/fields/input-field/text-field.vue';
import Modal from '@/components/modal.vue';
import { SubmittedSymbol, ValidatedFieldData } from '@/composables/types';
import { provide, reactive, ref } from 'vue';

const test = ref(false);
provide(SubmittedSymbol, test);

const items = ref([ 'ddd', 'eee', 'fff', 'ggg', 'hhh' ]);
const trigger = ref(false);
const toggle = () => {
    if (!trigger) {
        items.value = [ 'ddd', 'eee', 'fff', 'ggg', 'hhh' ];
        return;
    }

    items.value = [ 'ddd', 'eee', 'fff' ];
    // test.value = !test.value;

    // if (!trigger.value) {
    //     trigger.value = 'required';
    //     return;
    // }
    //
    // trigger.value = null;
};

const field = reactive([] as ValidatedFieldData[]);

const onUpdated = (data: ValidatedFieldData): void => {
    console.log(data);
    field[data.name] = data;
};

const modalOpened = ref<number>(null);
</script>

<style lang="scss">
*,
*:before,
*:after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    display: flex;
    align-items: center;
    min-height: 50vh;
    justify-content: center;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #35495e;
    display: grid;
    grid-row-gap: 1em;
    width: 100%;
    max-width: 25em;
    padding: 1em;
}

fieldset {
    border: 0;

    &:focus,
    &:focus-visible {
        outline: none;
    }
}
</style>
