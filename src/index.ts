import ScriptLoader, { LoadScriptOptions } from './script-loader'

export default async function loadScript<T>(src: string, options: LoadScriptOptions = {}) {
	const { id = src, cache = false } = options
	const fnCache = cache ? loadScriptCache : {}
	let cached = fnCache[id] ?? (fnCache[id] = new ScriptLoader(src, options))
	return cached.load<T>()
}

const loadScriptCache = {} as { [id: string]: ScriptLoader }
