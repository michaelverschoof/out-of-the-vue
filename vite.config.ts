import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

const src = resolve(__dirname, 'src');
const test = resolve(__dirname, 'test');
const snapshots = resolve(__dirname, 'snapshots');

export default defineConfig({
    plugins: [ vue() ],
    resolve: {
        alias: { '@': src, '@test': test }
    },
    build: {
        lib: {
            entry: `${ src }/index.ts`,
            name: 'OutOfTheVue',
            fileName: (format) => `out-of-the-vue.${ format }.js`
        },
        rollupOptions: {
            external: [ 'vue' ],
            output: {
                globals: {
                    vue: 'Vue'
                },
                sourcemapExcludeSources: true
            }
        }
    },
    test: {
        coverage: {
            reporter: [ 'html', 'lcov' ]
        },
        resolveSnapshotPath: (testPath, snapExtension) => {
            const path = testPath.split('/').splice(-2);
            return `${ snapshots }/${ path[0] }/${ path[1] }${ snapExtension }`;
        }
    }
});
