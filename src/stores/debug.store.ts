import { defineStore } from "pinia";
import { useScope } from "../helper/persist.helper";

const useScopedPersistingRef = useScope('debug');

export const useDebug = defineStore('debug', () => {
	const [showGap] = useScopedPersistingRef( 'showGap', true);
	const [showHovered] = useScopedPersistingRef( 'showHovered', true);
	const [showMousePosition] = useScopedPersistingRef('showMousePosition', true);
	const [showKeyPress] = useScopedPersistingRef('showKeyPress', false);

	return {
		showGap,
		showHovered,
		showMousePosition,
		showKeyPress
	};
})