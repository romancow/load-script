import LSPromise, { LoadScriptPromiseOptions } from './promise'

export type LoadScriptOptions<T> = LoadScriptPromiseOptions & {
	map?: T extends keyof Window ? T : (event: Event) => T
}

function loadScript(path: string, options?: LoadScriptPromiseOptions): Promise<HTMLScriptElement>
function loadScript<K extends keyof Window>(path: string, options: LoadScriptOptions<K>): Promise<Window[K]>
function loadScript<T>(path: string, options: LoadScriptOptions<T>): Promise<T>
function loadScript<T>(path: string, options?: LoadScriptOptions<T>) {
	const promise = LSPromise.get(path, options)
	return promise.map<T>(options?.map)
}

export default loadScript
