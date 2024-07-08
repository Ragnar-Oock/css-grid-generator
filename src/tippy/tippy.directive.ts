import type { CreateSingletonInstance, CreateSingletonProps, Instance, ReferenceElement, Props as TippyOptions } from "tippy.js";
import tippy, { createSingleton } from "tippy.js";
import { Directive } from "vue";
import { Prettify } from "../types/helper.type";
import { isDefined } from "../helper/type.helper";
import 'tippy.js/dist/tippy.css';

export type VTippyOptions = Prettify<{
	/**
	 * should the tippy be disable ? This allows to reactively enable or disable the tippy (destroys the instance when it is disabled)
	 */
	isDisabled?: boolean;
	/**
	 * Should the tippy be made part of a singleton. The string provided here is used as the identifier for the singleton.
	 * 
	 * @see {@link https://atomiks.github.io/tippyjs/v6/addons/#singleton Addons: Singleton}
	 */
	singletonName?: string;
	/**
	 * Provides overrides for tippies part of a singleton.
	 * 
	 * Has an effect only if the `singletonName` property is set and will only be updated when a singleton is recreated, avoid changing those reactively.
	 * 
	 * @see {@link https://atomiks.github.io/tippyjs/v6/addons/#singleton Addons: Singleton}
	 */
	singletonOverrides?: Partial<CreateSingletonProps>;
} & Partial<TippyOptions>>

type Singleton = {
	singleton: CreateSingletonInstance;
	instances: Instance[];
};

const singletonMap = new Map<string, Singleton>();

/**
 * Add a Tippy instance to a singleton instance.
 * @param name name/identifier of the singleton
 * @param instance instance to add to the singleton
 * @param overrides overrides to set to the singleton if it doesn't exist yet and needs to be created
 * 
 * @see {@link https://atomiks.github.io/tippyjs/v6/addons/#singleton Addons: Singleton}
 */
function addInstanceToSingleton(name: string, instance: Instance, overrides?: Partial<CreateSingletonProps>): void {
	const singleton = singletonMap.get(name) ?? {
		singleton: createSingleton([], overrides),
		instances: []
	};

	singleton.singleton.setInstances([...singleton.instances, instance])
	singletonMap.set(name, singleton);
}

function removeInstanceFromSingleton(name: string, instance: Instance): void {
	const singleton = singletonMap.get(name);
	if (typeof singleton === 'undefined') {
		return;
	}
	const instances = singleton.instances.filter(inSingleton => inSingleton !== instance);
	singleton.singleton.setInstances(instances);
}

/**
 * 
 * @param instance Tippy instance to remove from any singleton it might be part off
 */
function removeInstanceFromSingletons(instance: Instance): void {
	singletonMap.forEach((_, name) => removeInstanceFromSingleton(name, instance))
}

function destroyTippy(instance: Instance<TippyOptions>): void {
	instance.destroy();
	removeInstanceFromSingletons(instance);
}


export const vTippy = {
	mounted(element, binding) {

		const options = binding.value;
		if (options.isDisabled) {
			return;
		}

		const instance = tippy(element, options);

		if (options.singletonName) {
			addInstanceToSingleton(options.singletonName, instance, options.singletonOverrides);
		}

	},
	unmounted({_tippy: instance}) {
		if (typeof instance === 'undefined') {
			return;
		}
		destroyTippy(instance);
	},
	updated(element, binding) {
		let {_tippy: instance} = element;
		const {
			value: options,
			oldValue: oldOptions
		} = binding;
				
		// if the `isDisabled` option got switched to `true` we destroy the instance to "disable" it
		if (isDefined(instance) && options.isDisabled && oldOptions?.isDisabled === false) {
			destroyTippy(instance);
			return;
		}

		// if the instance doesn't exist (it might have been previously destroyed) (re)create it with the current options
		if (!isDefined(instance)) {
			instance = tippy(element, options);
		}

		// if the singletonName changed remove the instance from singletons it was in
		if (isDefined(oldOptions?.singletonName) && options.singletonName !== oldOptions.singletonName) {
			removeInstanceFromSingleton(oldOptions.singletonName, instance);

			// if the singletonName is set in the new options affect the instance to it
			if (isDefined(options.singletonName)) {
				addInstanceToSingleton(options.singletonName, instance, options.singletonOverrides);
			}
		}

		instance.setProps(options);
	}
} as const satisfies Directive<ReferenceElement<TippyOptions>, VTippyOptions>;
