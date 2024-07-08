<script setup lang="ts">
	import { Ref, computed, onMounted, onUnmounted, provide, ref } from "vue";
import { getAreasOnLine, makeArea } from "../helper/area.helper";
import { serializeExplicitTrackList, serializeTrack } from "../helper/css-normalize";
import { useGrid } from "../stores/grid.store";
import { Coord, isSameCoord, isSnappedToGrid, useMousePosition } from "../stores/mouse-position.store";
import { ExplicitTrack, containerSymbol, type ExplicitRowTrackObj, type ExplicitTrackList } from "../types/grid.type";
import { OneOrMore } from "../types/helper.type";
import { Interaction } from "../types/interaction.type";
import GridHeadColumn from "./tracks/GridHeadColumn.vue";
import GridHeadRow from "./tracks/GridHeadRow.vue";
import GridItem from './GridItem.vue';
import DevTools from './devtools/DevTools.vue';
import MousePosition from './devtools/MousePosition.vue';

	const grid = useGrid();

	// #region columns

	const effectiveColumnExplicitTrackList = computed(() => [
		...grid.columns.slice(0, -1),
		{lineNames: (grid.columns as ExplicitTrack[]).at(-1)?.lineNames, trackSize: 'auto'}
	])

	// #endregion
	
	// #region rows

	const rowTracks = computed(() => {
		const tracks: ExplicitRowTrackObj[] = grid.rows.map((row, index) => {
			const areas = getAreasOnLine(grid.areas, index + 1, grid.numberOfColumns);
			areas.push('labels-row');
			return { ...row, areas };
		});
		tracks.push({
			lineNamesStart: '',
			trackSize: 'auto',
			areas: [...Array.from({length: grid.numberOfColumns}, ()=> ('labels-column')), '.'],
			lineNamesEnd: ''
		},)
		return tracks;
	})

	const userRowTracks = computed({
		get: () => grid.rows.map(({lineNamesStart, trackSize, lineNamesEnd}, index) => ({
			lineNamesStart,
			areas: getAreasOnLine(grid.areas, index + 1, grid.numberOfColumns),
			trackSize,
			lineNamesEnd
		})) as OneOrMore<ExplicitRowTrackObj>,
		set: newValue => {
			grid.rows = [
				...newValue.map(({lineNamesStart, trackSize, lineNamesEnd}) => ({
					lineNamesStart,
					trackSize,
					lineNamesEnd
				})) as OneOrMore<ExplicitRowTrackObj>
			];
		}
	});

	// #endregion

	// #region templates

	const template = computed( () => `
${rowTracks.value.map(serializeTrack).join('\n')}
/ ${serializeExplicitTrackList(effectiveColumnExplicitTrackList.value)}
	`);

	const userTemplate = computed( () => `
${userRowTracks.value.map(serializeTrack).join('\n')}
/ ${serializeExplicitTrackList(grid.columns.slice(1) as ExplicitTrackList)}
	`);

	// #endregion
	
	// #region container
	const container = ref<HTMLElement>();
	provide(containerSymbol, container as Ref<HTMLElement>);
	// #endregion

	// #region add area interaction

	const mousePosition = useMousePosition();

	let clickStart: Coord | null = null;
	const addAreaInteraction = {
		start: () => {
			if (isSnappedToGrid(mousePosition.gridCoords)) {
				clickStart = mousePosition.gridCoords;
			}
		},
		finish: () => {
			if (clickStart !== null && isSameCoord(clickStart, mousePosition.gridCoords)) {
				grid.areas.push(makeArea(mousePosition.gridCoords));
			}

			clickStart = null;
		}
	} as const satisfies Interaction;

	onMounted(() => {
		document.addEventListener('mouseup', addAreaInteraction.finish);
	})

	onUnmounted(() => {
		document.removeEventListener('mouseup', addAreaInteraction.finish);
	})

	// #endregion
</script>

<template>
	<div 
		ref="container"
		class="grid-wrapper" 
		:style="{
			'grid-template': template,
		}"
	>
		<MousePosition/>
		<div 
			class="grid-container"
			@mousedown.exact.left="addAreaInteraction.start"
		>
			<DevTools
				:cols="grid.columns"
				:rows="grid.rows"	
			></DevTools>
			<GridItem
				v-for="item in grid.areas"
				:item="item"
				@update:item="grid.updateItem(item.area, $event)"
				@mousedown.stop
			/>
		</div>
		<GridHeadColumn :explicit-track-list="grid.columns"/>
		<GridHeadRow v-model:explicit-track-list="userRowTracks"/>
	</div>

	<pre class="copiable">
grid-template: {{ userTemplate }}
	</pre>

	<pre class="copiable">
actual grid-template : {{ template }}
	</pre>
</template>

<style lang="scss">
	.grid-wrapper {
		display: grid;
		--gap: .5rem;
		gap: var(--gap);

		user-select: none;
		overflow: auto;
		height: 100%;
		width: 100%;
		max-width: 1000px;
		max-height: 800px;
	}
	.grid-container {
		width: 100%;
		height: 100%;
		
		// outline: 1px solid black;

		display: grid;
		overflow: hidden;
		grid-area: 1/1/-2/-2;
		grid-template-rows: subgrid;
		grid-template-columns: subgrid;
	}

	.copiable {
		text-align: left;
	}
</style>

