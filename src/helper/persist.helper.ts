import { MaybeRef, ref, Ref, watch } from "vue";

export type PersistingRef<T> = [ref: Ref<T>, destroy: () => void];

/**
 * Persist a reactive value in localstorage (if possible)
 * @param name the name of the localstorage item used to persiste the ref
 */
export function usePersistingRef<T>(name: string): PersistingRef<T|undefined>;
/**
 * Persist a reactive value in localstorage (if possible)
 * @param name the name of the localstorage item used to persiste the ref
 * @param defaultValue a value to use as a fallback when there's no item in the local storage or it's not accessible
 */
export function usePersistingRef<T>(name: string, defaultValue: MaybeRef<T>): PersistingRef<T>;
export function usePersistingRef<T>(name: string, defaultValue?: MaybeRef<T>): PersistingRef<T|undefined> {
	let persisted: T | undefined;
	try {
		const item = localStorage.getItem(name);
		if (item !== null) {
			persisted = JSON.parse(item) as T ?? undefined;
		}
	} catch (error) {
		if (import.meta.env.DEV) {
			console.warn(`LocalStorage not available, using default for persistingRef "${name}".`);
		}
	}

	const toPersist = ref(persisted ?? defaultValue) as Ref<T>;

	const destroy = watch(toPersist, value => {
		if (typeof value !== 'undefined') {
			localStorage.setItem(name, JSON.stringify(value));
		}
		else {
			localStorage.removeItem(name);
		}
	})

	return [
		toPersist,
		destroy
	]
}

export function useScope(scope: string): typeof usePersistingRef {
	return ((name, defaultValue) => usePersistingRef(`${scope}:${name}`, defaultValue)) as typeof usePersistingRef;
}