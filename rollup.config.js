import image from '@rollup/plugin-image';
import url from '@rollup/plugin-url';
import buble from '@rollup/plugin-buble';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.js',
  output: {
    file: 'bundle.js',
    format: 'iife'
  },
  plugins: [
    !production && serve({ open: true, contentBase: '.', port: 3000 }),
    !production && livereload(),
    nodeResolve(),
    commonJs(),
    image(),
    url(),
    postcss({
      extract: true,
      minimize: production,
      plugins: [autoprefixer()]
    }),
    buble(),
    production && terser()
  ]
};
