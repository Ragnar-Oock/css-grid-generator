<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import { useDebug } from '../../stores/debug.store';
import { useMousePosition } from '../../stores/mouse-position.store';
import { ExplicitRowTrackState, ExplicitTrackList, Track, containerSymbol } from '../../types/grid.type';
import { OneOrMore } from '../../types/helper.type';

// #region create the elements
const props = defineProps<{
	rows: OneOrMore<ExplicitRowTrackState>;
	cols: ExplicitTrackList;
}>();

const rowFillers = computed(() => {
	return props.rows.map((_, index) => index + 1);
});

const colFillers = computed(() => {
	return props.cols.slice(2).map((_, index) => index + 1);
});

// #endregion

// #region use elements to find where something is in the grid
const container = inject(containerSymbol);

const rowElements = ref<HTMLDivElement[]>();
const colElements = ref<HTMLDivElement[]>();


let rowCachedBoundingRects: Track[] = [];
let colCachedBoundingRects: Track[] = [];


function getTracks(elements: HTMLDivElement[]): Track[] {
	return elements
		.map(row => ({
			domRect: row.getBoundingClientRect(),
			index: Number(row.dataset.index)
		} as const))
		.sort((left, right) => left.index - right.index);
}

const observer = new ResizeObserver(() => {
	rowCachedBoundingRects = getTracks(rowElements.value ?? []);
	colCachedBoundingRects = getTracks(colElements.value ?? []);
});

function getActive({ clientX: x, clientY: y }: MouseEvent, tracks: Track[]): Track | null {
	return tracks.find(({ domRect: { left, right, top, bottom } }) => left <= x && x <= right && top <= y && y <= bottom) ?? null;
}
// #endregion

// #region mouse position update
const mousePosition = useMousePosition();

onMounted(() => {
	const containerElement = container!.value;

	observer.observe(containerElement);
	containerElement.addEventListener('mousemove', event => {
		mousePosition.mouseInGrid.x = getActive(event, colCachedBoundingRects);
		mousePosition.mouseInGrid.y = getActive(event, rowCachedBoundingRects);
	});
	containerElement.addEventListener('mouseleave', () => {
		mousePosition.mouseInGrid.x = null;
		mousePosition.mouseInGrid.y = null;
	})
});

onUnmounted(() => {
	observer.disconnect();
});
// #endregion

// #region toggle devtools
const debug = useDebug();
// #endregion
</script>

<template>
	<div
		class="devtools"
		:class="{
			'show-hovered': debug.showHovered,
			'show-gap': debug.showGap
			}"
	>
		<div 
			class="grid-row gap-filler"
		 	v-for="index in rowFillers" 
		 	:style="{ 'grid-row-start': index }" 
		 	:class="{
				hover: mousePosition.matchRow(index)
			}"
		 	:data-index="index"
		  ref="rowElements"
		></div>
		<div 
			class="grid-col gap-filler"
			v-for="index in colFillers"
			:style="{ 'grid-column-start': index }"
			:data-index="index"
			:class="{
				hover: mousePosition.matchCol(index)
			}"
			ref="colElements"
		></div>
	</div>
	
</template>

<style scoped lang="scss">

.devtools {
	display: contents;
	pointer-events: none;
	.grid-row {
		grid-row-end: span 1;
		grid-column: 1 / -1;

		&::after {
			inset: 100% 0 calc(var(--gap) * -1) 0;
		}
	}

	.grid-col {
		grid-column-end: span 1;
		grid-row: 1 / -1;

		&::after {
			inset: 0 calc(var(--gap) * -1) 0 100%;
		}
	}
}

.show-hovered .hover {
	outline: 2px solid rgba(223, 13, 58, 0.288);
	outline-offset: -4px;
}

.show-gap {
	.gap-filler {
		position: relative;
	}

	.gap-filler:not(:last-child)::after {
		--gap-color-1: #803d93c4;
		--gap-color-2: transparent;
		--gradient-size: 20px;

		content: '';
		position: absolute;
		border: 1px solid var(--gap-color-1);

		background: linear-gradient(-45deg,
				var(--gap-color-1) 5%,
				var(--gap-color-2) 5%, var(--gap-color-2) 50%,
				var(--gap-color-1) 50%, var(--gap-color-1) 55%,
				var(--gap-color-2) 55%) 0 / var(--gradient-size) var(--gradient-size);
	}
}
</style>