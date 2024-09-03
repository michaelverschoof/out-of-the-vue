/// <reference types="vitest" />
/// <reference types="histoire" />

import { HstVue } from '@histoire/plugin-vue';
import vue from '@vitejs/plugin-vue';
import { defaultColors } from 'histoire';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const src = resolve(__dirname, 'src');
const test = resolve(__dirname, 'test');
const snapshots = resolve(__dirname, 'snapshots');

export default defineConfig({
    resolve: {
        alias: {
            '@': src,
            '@test': test
        }
    },
    build: {
        target: 'esnext',
        lib: {
            entry: `${src}/index.ts`,
            name: 'OutOfTheVue'
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                exports: 'named',
                assetFileNames: 'out-of-the-vue.[ext]',
                globals: {
                    vue: 'Vue'
                }
            }
        }
    },
    plugins: [
        vue(),
        dts({
            tsconfigPath: 'tsconfig.build.json',
            outDir: 'dist/types',
            rollupTypes: true
        })
    ],

    // Vitest Configuration
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov']
        },
        resolveSnapshotPath: (path: string, extension: string) => {
            const split = path.split('/').splice(-2);
            return `${snapshots}/${split[0]}/${split[1]}${extension}`;
        }
    },

    // Histoire configuration
    histoire: {
        plugins: [HstVue()],
        setupFile: './histoire/setup.ts',
        theme: {
            title: 'Out of the Vue',
            colors: {
                primary: defaultColors.orange
            }
        }
    }
});
