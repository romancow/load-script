import LSPromise, { LoadScriptPromiseOptions } from './promise'

/**
 * Script load options
 * More details on the attribute options [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#Attributes).
 * */
export type LoadScriptOptions = LoadScriptPromiseOptions & {
	/** Whether to get/set the script in cache */
	cache?: boolean
}

/**
 * Loads the given script as an `HTMLScriptElement`.
 *
 * @param url - Url of the script to load
 * @param options - Script load options
 * @returns A promise for the loaded script's `HTMLScriptElement`
 */
function loadScript(url: string, options?: LoadScriptOptions): Promise<HTMLScriptElement>
/**
 * Loads the given script as an `HTMLScriptElement`.
 *
 * @template K - Window key of the return value
 * @param url - Url of the script to load
 * @param options - Script load options with a `map` key of a window value to return
 * @returns A promise for the specified Window value after the script is loaded
 */
function loadScript<K extends keyof Window>(url: string, options: LoadScriptOptions & { map: K }): Promise<Window[K]>
/**
 * Loads the given script as an `HTMLScriptElement`.
 *
 * @template T - The type of value to return a promise for
 * @param url - Url of the script to load
 * @param options - Script load options with a `map` function to retrieve the return value
 * @returns A promise for the value returned by the `map` function after the script is loaded
 */
function loadScript<T>(url: string, options: LoadScriptOptions & { map: (event: Event) => T }): Promise<T>
function loadScript(url: string, options?: LoadScriptOptions & { map?: (keyof Window) | ((event: Event) => any) }) {
	const { cache = false, map } = options ?? {}
	const promise = LSPromise.get(url, cache, options)
	return promise.map(map)
}

export default loadScript
