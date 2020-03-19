import * as Utilities from './utilities'


type LoadScriptAttributes = {
	async?: boolean
	defer?: boolean
	crossOrigin?: string
	id?: string
	integrity?: string
	noModule?: boolean
	nonce?: string
	referrerPolicy?: string
	type?: string
}

namespace LoadScriptAttributes {
	export const Names: readonly (keyof LoadScriptAttributes)[] =
		['async', 'defer', 'crossOrigin', 'id', 'integrity', 'noModule', 'nonce', 'referrerPolicy', 'type']

	export function select(attrs: LoadScriptAttributes) {
		return Utilities.Object.select(attrs, Names)
	}
}

export type LoadScriptPromiseOptions = LoadScriptAttributes & {
	parent?: string | Element
	force?: boolean
}

export default class LoadScriptPromise extends Promise<Event> {

	element!: HTMLScriptElement

	constructor(readonly path: string, readonly options: LoadScriptPromiseOptions = {}) {
		super((onload, onerror) => {
			const attrs = { ...this.attrs, onload, onerror }
			this.element = Utilities.Element.create('script', attrs)
			this.parent.appendChild(this.element)
		})
	}

	protected get parent() {
		const { parent = document.head } = this.options
		return (parent instanceof Element) ? parent :
			document.querySelector(parent) ?? document.head
	}

	protected get attrs() {
		const { path, options } = this
		const src = options.force ? Utilities.String.preventBrowserCache(path) : path
		const attrs = LoadScriptAttributes.select(options)
		return Utilities.Object.compact({ src, ...attrs})
	}

	map<T = HTMLScriptElement>(map?: T extends keyof Window ? T : ((ev: Event) => T)) {
		const mapFn = (map != null) ? (map instanceof Function) ?
			map : () => window[map as keyof Window] : () => this.element
		return this.then(mapFn as (ev: Event) => T)
	}


	static Cache = {} as { [id: string]: LoadScriptPromise }

	static get(path: string, cache: boolean, options: LoadScriptPromiseOptions = {}) {
		const { id = path } = options
		const lsCache = cache ? this.Cache : {}
		return lsCache[id] ?? (lsCache[id] = new this(path, options))
	}
}
