import * as Utilities from './utilities'


type LoadScriptAttributes = {
	/** The script's "async" attribute */
	async?: boolean
	/** The script's "defer" attribute */
	defer?: boolean
	/** The script's "crossorigin" attribute */
	crossOrigin?: string
	/** Cache id and script element's "id" attribute */
	id?: string
	/** The script's "integrity" attribute */
	integrity?: string
	/** The script's "nomodule" attribute */
	noModule?: boolean
	/** The script's "nonce" attribute */
	nonce?: string
	/** The script's "referrerpolicy" attribute */
	referrerPolicy?: string
	/** The script's "type" attribute */
	type?: string
}

namespace LoadScriptAttributes {
	export const Names: readonly (keyof LoadScriptAttributes)[] =
		['async', 'defer', 'crossOrigin', 'id', 'integrity', 'noModule', 'nonce', 'referrerPolicy', 'type']

	export function select(attrs: LoadScriptAttributes) {
		return Utilities.Object.select(attrs, Names)
	}
}

/**
 * Script load options.
 * More details on the attribute options [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#Attributes).
 * */
export type LoadScriptPromiseOptions = LoadScriptAttributes & {
	/** The element or query selector of the element to append the created script element to */
	parent?: string | Element
	/** Whether to "force" the script to reload by appending a query string to circumvent browser caching */
	force?: boolean
}

/** Custom promise that resolves when the associated script is loaded. */
export default class LoadScriptPromise implements PromiseLike<Event> {

	/** The script element created by the promise */
	element!: HTMLScriptElement
	/**
	 * Attaches callbacks for the resolution and/or rejection of the Promise.
	 * @param onfulfilled The callback to execute when the Promise is resolved.
	 * @param onrejected The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of which ever callback is executed.
	 */
	then: Promise<Event>['then']

	/**
	 * Creates an instance of LoadScriptPromise.
	 *
	 * @param url - Url of the script to load.
	 * @param options - Options for loading the given script.
	 */
	constructor(readonly url: string, readonly options: LoadScriptPromiseOptions = {}) {
		const promise = new Promise<Event>((onload, onerror) => {
			const attrs = { ...this.attrs, onload, onerror }
			this.element = Utilities.Element.create('script', attrs)
			this.parent.appendChild(this.element)
		})
		this.then = (...args) => promise.then(...args)
	}

	/** Gets the parent element the created script element should be appended to */
	protected get parent() {
		const { parent = document.head } = this.options
		return (parent instanceof Element) ? parent :
			document.querySelector(parent) ?? document.head
	}

	/** Gets the attributes for the created script element. */
	protected get attrs() {
		const { url: path, options } = this
		const src = options.force ? Utilities.String.preventBrowserCache(path) : path
		const attrs = LoadScriptAttributes.select(options)
		return Utilities.Object.compact({ src, ...attrs})
	}

	/**
	 * Maps the promise value to another based on a global (`window`) value or method return value.
	 *
	 * @template T - `window` key or method return type
	 * @param map - Global key or map function that dictates the promise's value
	 * @returns A promise for the mapped value
	 */
	map<T = HTMLScriptElement>(map?: T extends keyof Window ? T : ((ev: Event) => T)) {
		const mapFn = (map != null) ? (map instanceof Function) ?
			map : () => window[map as keyof Window] : () => this.element
		return this.then(mapFn as (ev: Event) => T)
	}


	/** Cache for created scripts */
	static Cache = {} as { [id: string]: LoadScriptPromise }

	/**
	 * Gets a promise for the script either from cache or by creating a new one.
	 *
	 * @param url - Url for the script to get from cache or create
	 * @param cache - Whether to check cache for the give script before creating
	 * @param options - Options used to load new script (not used if found in cache)
	 * @returns Promise for loading the given script, either new or from cache
	 */
	static get(url: string, cache: boolean, options: LoadScriptPromiseOptions = {}) {
		const { id = url } = options
		const lsCache = cache ? this.Cache : {}
		return lsCache[id] ?? (lsCache[id] = new this(url, options))
	}
}
