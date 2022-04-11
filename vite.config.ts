import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const src = resolve(__dirname, 'src');

export default defineConfig({
    plugins: [ vue() ],
    resolve: {
        alias: { '@': src }
    }
});
