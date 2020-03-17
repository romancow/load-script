import VERSION from 'consts:version'
import * as Utilities from './utilities'

type LoadScriptMapFn = <T>(this: HTMLScriptElement, event: Event) => T

type LoadScriptOptions = {
	type?: string
	async?: boolean
	id?: string
	parent?: string | Element
	map?: string | LoadScriptMapFn,
	cache?: boolean,
	force?: boolean
}

namespace LoadScriptOptions {
	export const defaultMap = function (this: HTMLScriptElement, event: Event) { return this } as LoadScriptMapFn
}

export { LoadScriptOptions }

export default class ScriptLoader {

	constructor(readonly path: string, readonly options: LoadScriptOptions = {}) {}

	get src() {
		const { path, options: { force = true } } = this
		return force ? ScriptLoader.preventBrowserCache(path) : path
	}

	get parent() {
		const { parent = document.head } = this.options
		return (parent instanceof Element) ? parent :
			document.querySelector(parent) ?? document.head
	}

	get map(): LoadScriptMapFn {
		const { map } = this.options
		return (map != null) ? (map instanceof Function) ?
			map : () => (window as any)[map] : LoadScriptOptions.defaultMap
	}

	get attrs() {
		const { src, options: { type = "text/javascript", async, id }} = this
		return Utilities.Object.compact({ src, type, async, id})
	}

	createElement() {
		const { attrs } = this
		const script = document.createElement("script")
		Utilities.Object.assign(script, attrs)
		script.dataset.loadScript = VERSION
		return script
	}

	async load<T>() {
		const { parent, map } = this
		const script = this.createElement()
		const event = await new Promise<Event>((resolve, reject) => {
			script.onload = resolve
			script.onerror = reject
			parent.appendChild(script)
		})
		return map.call(script, event) as T
	}

	static preventBrowserCache(src: string) {
		const cacheId = Date.now().toString(36)
		const separator = (src.indexOf('?') < 0) ? '?' : '&'
		return src + separator + cacheId
	}
}
