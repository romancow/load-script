import pkg from './package.json'
import typescript from '@rollup/plugin-typescript'
import consts from 'rollup-plugin-consts'
import { terser } from 'rollup-plugin-terser'

export default {
	input: pkg.rollup,
	context: 'window',
	output: [
		{
			file: pkg.module,
			format: 'module',
			sourcemap: true,
			sourcemapExcludeSources: true
		},
		{
			name: 'loadScript',
			file: pkg.browser,
			format: 'umd',
			sourcemap: true,
			sourcemapExcludeSources: true
		}
	],
	plugins: [
		typescript(),
		consts({ version: pkg.version }),
		terser()
	]
}
