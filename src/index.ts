import LoadScriptPromise, { LoadScriptOptions, LoadScriptMapFn } from './load-script-promise'

export default async function loadScript<T>(src: string, options: LoadScriptOptions = {}) {
	const { id = src, cache = false, map } = options
	const fnCache = cache ? loadScriptCache : {}
	const promise = fnCache[id] ?? (fnCache[id] = new LoadScriptPromise(src, options))
	const mapFn = LoadScriptMapFn.ensure(map ?? promise)
	return promise.then<T>(mapFn)
}

const loadScriptCache = {} as { [id: string]: LoadScriptPromise }
