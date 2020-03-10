import pkg from './package.json'
import { terser } from 'rollup-plugin-terser'

export default {
	input: pkg.module,
	context: 'window',
	output: {
		name: "LoadScript",
		file: pkg.browser,
		format: 'umd',
		sourcemap: true,
		sourcemapExcludeSources: true
	},
	plugins: [terser()]
}
