import path from 'path';
import ts from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/index.ts',
    output: {
        export: 'auto',
        format: 'cjs',
        file: path.resolve(__dirname, 'dist/bundle.js'),
    },
    plugins: [
        ts({
            tsconfig: path.resolve('tsconfig.json'), //表示ts使用的配置文件
        }),
        nodeResolve({
            extensions: ['.js','.ts'],
        })
    ]
}