import { defineStore } from "pinia";
import { useScope } from "../helper/persist.helper";

const useScopedPersistingRef = useScope('debug');

export const useDebug = defineStore('debug', () => {
	const [showGap] = useScopedPersistingRef( 'showGap', true);
	const [showHovered] = useScopedPersistingRef( 'showHovered', true);
	const [showMousePosition] = useScopedPersistingRef('showMousePosition', true);

	return {
		showGap,
		showHovered,
		showMousePosition
	};
})