/// <reference types="vitest" />
/// <reference types="histoire" />

import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import { HstVue } from '@histoire/plugin-vue';

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
            tsConfigFilePath: 'tsconfig.build.json',
            outputDir: 'dist/types',
            rollupTypes: true
        })
    ],

    // Vitest Configuration
    test: {
        coverage: {
            reporter: ['text', 'lcov']
        },
        resolveSnapshotPath: (testPath, snapExtension) => {
            const path = testPath.split('/').splice(-2);
            return `${snapshots}/${path[0]}/${path[1]}${snapExtension}`;
        }
    },

    // Histoire configuration
    histoire: {
        setupFile: './histoire/setup.ts',
        plugins: [HstVue()]
    }
});
