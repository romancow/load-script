import LoadScriptPromise, { LoadScriptOptions } from './load-script-promise'

export default async function loadScript<T>(path: string, options?: LoadScriptOptions) {
	const promise = LoadScriptPromise.get(path, options)
	return promise.map(options?.map)
}
