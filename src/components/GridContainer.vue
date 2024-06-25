<script setup lang="ts">
	import { computed, provide, ref } from "vue";
	import { getRandomColor } from "../helper/color.helper";
	import { serializeExplicitTrackList, serializeTrack } from "../helper/css-normalize";
	import GridHeadColumn from "./GridHeadColumn.vue";
	import GridHeadRow from "./GridHeadRow.vue";
	import GridItem from './GridItem.vue';
	import { ExplicitRowTrackState, ExplicitTrack, GridArea, Item, OneOrMore, containerSymbol, type ExplicitRowTrackObj, type ExplicitTrackList } from "./grid";
	import { getAreasOnLine } from "../helper/area.helper";
	import DevTools from './devtools/DevTools.vue';
	import MousePosition from './devtools/MousePosition.vue';


	// #region areas

	const areaItems = ref<GridArea[]>([
		{
			area: 'bob',
			color: getRandomColor(),
			columnStart: 2,
			columnEnd: 3,
			rowStart: 1,
			rowEnd: 2
		}
	]);

	function updateItem(newItem: GridArea, oldItem: GridArea): void {
		const index = areaItems.value.findIndex(({area}) => area === oldItem.area)
		if (index === -1) {
			return;
		}

		areaItems.value[index] = newItem;
	}

	// #endregion

	// #region columns

	const columnExplicitTrackList = ref<ExplicitTrackList>([
		{trackSize: 'auto'},
		{trackSize: 'auto'},
		{trackSize: 'auto'},
		{trackSize: 'auto', lineNames: '[boris-start]'},
		{trackSize: 'auto'},
		{trackSize: '', lineNames: '[boris-end]'}
	]);
	const userColumnExplicitTrackList = computed(() => columnExplicitTrackList.value.slice(1, length - 1) as OneOrMore<ExplicitTrack>);

	// #endregion
	
	// #region rows

	const rows = ref<OneOrMore<ExplicitRowTrackState>>([
		{
			lineNamesStart: '[boris-start]',
			trackSize: 'auto',
			// areas: ['.', ...Array.from({length: columnExplicitTrackList.value.length - 2}, ()=> ('labels-column'))],
			lineNamesEnd: '[boris-end]'
		},
		{
			lineNamesStart: '',
			trackSize: 'auto',
			// areas: ['labels-row', 'bob', 'bob', 'bob', 'bob'],
			lineNamesEnd: '',
		},
		{
			lineNamesStart: '',
			trackSize: 'auto',
			// areas: ['labels-row', 'bob', 'bob', 'bob', 'bob'],
			lineNamesEnd: '',
		},
		{
			lineNamesStart: '',
			trackSize: 'auto',
			// areas: ['labels-row', 'bob', 'bob', 'bob', 'bob'],
			lineNamesEnd: '',
		}
	]);

	const rowTracks = computed(() => {
		const tracks: ExplicitRowTrackObj[] = rows.value.map((row, index) => {
			const areas = getAreasOnLine(areaItems.value, index + 1, columnExplicitTrackList.value.length - 2);
			areas.unshift('labels-row');
			return { ...row, areas };
		});
		tracks.unshift({
			lineNamesStart: '',
			trackSize: 'auto',
			areas: ['.', ...Array.from({length: columnExplicitTrackList.value.length - 2}, ()=> ('labels-column'))],
			lineNamesEnd: ''
		},)
		return tracks;
	})

	const userRowTracks = computed({
		get: () => rows.value.map(({lineNamesStart, trackSize, lineNamesEnd}, index) => ({
			lineNamesStart,
			areas: getAreasOnLine(areaItems.value, index + 1, columnExplicitTrackList.value.length - 2),
			trackSize,
			lineNamesEnd
		})) as OneOrMore<ExplicitRowTrackObj>,
		set: newValue => {
			rows.value = [
				rows.value[0],
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
/ ${serializeExplicitTrackList(columnExplicitTrackList.value)}
	`);

	const userTemplate = computed( () => `
${userRowTracks.value.map(serializeTrack).join('\n')}
/ ${serializeExplicitTrackList(columnExplicitTrackList.value.slice(1) as ExplicitTrackList)}
	`);

	// #endregion
	
	// #region container
	const container = ref<HTMLElement>();
	provide(containerSymbol, container);
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
		<GridHeadColumn :explicit-track-list="userColumnExplicitTrackList"/>
		<GridHeadRow v-model:explicit-track-list="userRowTracks"/>

		<MousePosition/>
		<div class="grid-container">
			<DevTools
				:cols="columnExplicitTrackList"
				:rows="rows"	
			></DevTools>
			<GridItem
				v-for="item in areaItems"
				:item="item"
				@update:item="updateItem($event, item)"
			/>
		</div>
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
		
		outline: 1px solid black;

		display: grid;
		overflow: hidden;
		grid-area: 2/2/-1/-1;
		grid-template-rows: subgrid;
		grid-template-columns: subgrid;
	}

	.copiable {
		text-align: left;
	}
</style>

