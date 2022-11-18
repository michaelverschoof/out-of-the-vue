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
