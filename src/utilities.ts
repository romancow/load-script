import Version from 'consts:version'

namespace _Object {

	export function keys<T extends Object, K extends keyof T>(obj: T) {
		return Object.keys(obj) as (K)[]
	}

	export function forEach<T extends Object, K extends keyof T>(obj: T, fn: (val: T[K], key: K, obj: T) => void) {
		keys<T, K>(obj).forEach(key => fn.call(obj, obj[key], key, obj))
	}

	export function assign<T extends Object, S extends Object>(target: T, ...sources: S[]) {
		const to = Object(target)
		sources.forEach(src =>
			forEach(src, (val, key) => to[key] = val)
		)
		return to as T & S
	}

	export function filter<T extends Object, K extends keyof T>(obj: T, filterFn: (val: T[K], key: K, obj: T) => boolean) {
		const keys = Object.keys(obj) as K[]
		return keys.reduce((filtered, key) => (filtered[key] = obj[key], filtered), {} as Partial<T>)
	}

	export function compact<T extends Object>(obj: T, all = false) {
		return filter(obj, val =>  all ? !!val : (val != null)) as { [K in keyof T]: T[K] }
	}

}

namespace _String {

	export function preventBrowserCache(src: string) {
		const cacheId = Date.now().toString(36)
		const separator = (src.indexOf('?') < 0) ? '?' : '&'
		return src + separator + cacheId
	}

}

namespace _Element {

	export function create<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Partial<HTMLElementTagNameMap[K]>) {
		const elem = document.createElement(tag)
		_Object.assign(elem, attrs)
		elem.dataset.loadScript = Version
		return elem as HTMLElementTagNameMap[K]
	}

}

export {
	_Object as Object,
	_String as String,
	_Element as Element,
	Version
}
