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

export {
	_Object as Object
}
