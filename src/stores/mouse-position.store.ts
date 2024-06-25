import { defineStore } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import { Track } from "../types/grid.type";

export type Coord = {x: number, y: number}

export const useMousePosition = defineStore('mouse-position', () => {
	const mouse = reactive({x: 0, y: 0});
	const mouseInGrid = reactive<{
		x: Track | null,
		y: Track | null,
	}>({x: null, y: null});

	/**
	 * position of the mouse in the grid by row and col number (0,0 if not within the grid)
	 */
	const gridCoords = computed(() => ({
		y: mouseInGrid.y?.index ?? 0,
		x: mouseInGrid.x?.index ?? 0,
	}))

	const lastValidPosition = ref({x: 0, y: 0});

	watch(gridCoords, (newValue, oldValue) => {
		if (isSnappedToGrid(newValue)) {
			lastValidPosition.value = newValue;
			return;
		}
		if (isSnappedToGrid(oldValue)) {
			lastValidPosition.value = oldValue;
			return;
		}		
	})

	function isSnappedToGrid({x, y}: Coord): boolean {
		return x !== 0 && y !== 0;
	}
	function isInGrid({x, y}: Coord): boolean {
		return x !== 0 || y !== 0
	}

	function matchCol(index: number): boolean {
		return lastValidPosition.value.x === index && isInGrid(gridCoords.value);
	}
	function matchRow(index: number): boolean {
		return lastValidPosition.value.y === index && isInGrid(gridCoords.value);
	}

	return {
		mouse,
		mouseInGrid,
		matchCol,
		matchRow,
		gridCoords,
		lastValidPosition,
		isSnappedToGrid,
		isInGrid
	};
})