import * as Utilities from './utilities'

type LoadScriptMapFn = <T>(this: LoadScriptPromise, event: Event) => T

namespace LoadScriptMapFn {
	export const defaultMap = function (this: LoadScriptPromise, event: Event) { return this.element } as LoadScriptMapFn

	export function ensure(fn: string | LoadScriptMapFn | LoadScriptPromise): LoadScriptMapFn {
		return !(fn instanceof LoadScriptPromise) ? (fn instanceof Function) ?
			fn : () => (window as any)[fn] : () => fn.element
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
}
