<h1 align="center">Out of the Vue</h1>
<p align="center">A functional component library based on Vue 3 and Vite</p>

<p align="center">
  <a href="https://www.npmjs.com/package/out-of-the-vue">
    <img src="https://img.shields.io/npm/v/out-of-the-vue.svg" alt="Version">
  </a>

  <a href="https://www.npmjs.com/package/out-of-the-vue">
    <img src="https://img.shields.io/npm/dt/out-of-the-vue.svg" alt="Total downloads">
  </a>
  <a href="https://www.npmjs.com/package/out-of-the-vue">
    <img src="https://img.shields.io/npm/dm/out-of-the-vue.svg" alt="Monthly downloads">
  </a>
  <br>
  <a href="https://codecov.io/gh/michaelverschoof/out-of-the-vue">
    <img src="https://codecov.io/gh/michaelverschoof/out-of-the-vue/branch/main/graph/badge.svg?token=78XM22TM4V" alt="Code coverage" />
  </a>
  <a href="https://github.com/michaelverschoof/out-of-the-vue/blob/main/LICENSE.md">
    <img src="https://img.shields.io/npm/l/out-of-the-vue.svg" alt="License">
  </a>
</p>

### Introduction

Out-of-the-vue is a Vue component library focused on offering functionality rather than design. No more messing around with the same functionalities (such as
form field validations, modals, etc.) for each project, so you can focus on your features.

The project provides a very minimal design for layout but other than that, you're completely free to make it your own.

#### Features

- Lightweight with **automatic** tree-shaking
- **Rich features**
- Out-of-the-box **TypeScript** support
- **Fully tested** using [Vitest](https://vitest.dev/)
- Functionalities can be used as both **components as composables**
- **Build your own** components using the base components as building blocks

#### Some functionalities:

> Out-of-the-vue requires Vue >= v3

- Most common form field validations with the possibility to add custom validations
- Adding custom error messages, field helpers and labels
- User input debouncing
- Word / character counting
- Custom content in (for example) checkboxes and radio buttons
- Opening and closing of modals is provided by the component

### Getting started

#### Installing the package:

```bash
$ npm install out-of-the-vue
```

#### Using a component in your project:

```ts
import { TextField } from 'out-of-the-vue';
```

```html 
<text-field name="myTextField" required :min="10" :max="255"
            @created="onCreated" @updated="onUpdated"
>
    <template #label>My text field</template>
    <template #required>This field is required</template>
    <template #min>Min 10 characters required</template>
    <template #max>Max 255 characters allowed</template>
</text-field>
```

### License

[MIT](./LICENSE) License © 2022-present [Michael Verschoof](https://github.com/michaelverschoof) and out-of-the-vue contributors.
