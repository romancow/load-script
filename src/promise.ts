import * as Utilities from './utilities'

export type LoadScriptPromiseOptions = {
	type?: string
	async?: boolean
	id?: string
	parent?: string | Element
	cache?: boolean,
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
		const { path, options: { type = "text/javascript", async, id, force = true }} = this
		const src = force ? Utilities.String.preventBrowserCache(path) : path
		return Utilities.Object.compact({ src, type, async, id})
	}

	map<T = HTMLScriptElement>(map?: T extends keyof Window ? T : ((ev: Event) => T)) {
		const mapFn = (map != null) ? (map instanceof Function) ?
			map : () => window[map as keyof Window] : () => this.element
		return this.then(mapFn as (ev: Event) => T)
	}


	static Cache = {} as { [id: string]: LoadScriptPromise }

	static get(path: string, options: LoadScriptPromiseOptions = {}) {
		const { id = path, cache = false } = options
		const lsCache = cache ? this.Cache : {}
		return lsCache[id] ?? (lsCache[id] = new this(path, options))
	}
}
