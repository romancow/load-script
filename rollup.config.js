import pkg from './package.json'
import consts from 'rollup-plugin-consts'
import { terser } from 'rollup-plugin-terser'

export default {
	input: pkg.module,
	context: 'window',
	output: {
		name: 'loadScript',
		file: pkg.browser,
		format: 'umd',
		sourcemap: true,
		sourcemapExcludeSources: true
	},
	plugins: [
		consts({ version: pkg.version }),
		terser()
	]
}
