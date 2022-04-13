import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

const src = resolve(__dirname, 'src');

console.log(src);

export default defineConfig({
    plugins: [ vue() ],
    resolve: {
        alias: { '@': src }
    },
    test: {}
});
