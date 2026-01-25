import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

esbuild.build({
    entryPoints: ['src/index.jsx'],
    bundle: true,
    outfile: 'dist/index.js',
    format: 'esm',
    plugins: [sassPlugin()],
    loader: {
        '.png': 'dataurl',
        '.jpg': 'dataurl',
        '.svg': 'dataurl',
        '.jsx': 'jsx'
    },
    external: ['react', 'react-dom']
}).catch(() => process.exit(1));
