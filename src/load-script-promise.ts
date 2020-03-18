import * as Utilities from './utilities'

type LoadScriptMapFn = <T>(this: LoadScriptPromise, event: Event) => T

namespace LoadScriptMapFn {
	export function ensure(fn?: string | LoadScriptMapFn): LoadScriptMapFn | null {
		return (fn != null) ? (fn instanceof Function) ?
			fn : () => (window as any)[fn] : null
	}
}

type LoadScriptOptions = {
	type?: string
	async?: boolean
	id?: string
	parent?: string | Element
	map?: string | LoadScriptMapFn,
	cache?: boolean,
	force?: boolean
}

export { LoadScriptOptions, LoadScriptMapFn }

export default class LoadScriptPromise extends Promise<Event> {

	element!: HTMLScriptElement

	constructor(readonly path: string, readonly options: LoadScriptOptions = {}) {
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

	map(map: string | LoadScriptMapFn = (() => this.element) as LoadScriptMapFn) {
		const mapFn = LoadScriptMapFn.ensure(map)
		return this.then(mapFn)
	}


	static Cache = {} as { [id: string]: LoadScriptPromise }

	static get(path: string, options: LoadScriptOptions = {}) {
		const { id = path, cache = false } = options
		const lsCache = cache ? this.Cache : {}
		return lsCache[id] ?? (lsCache[id] = new this(path, options))
	}
}
