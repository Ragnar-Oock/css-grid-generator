<script setup lang="ts">
	import { computed, ref } from "vue";
	import { getRandomColor } from "../helper/color.helper";
	import { serializeExplicitTrackList, serializeTrack } from "../helper/css-normalize";
	import GridHeadColumn from "./GridHeadColumn.vue";
	import GridHeadRow from "./GridHeadRow.vue";
	import GridItem from './GridItem.vue';
	import { ExplicitTrack, OneOrMore, type ExplicitRowTrackObj, type ExplicitTrackList } from "./grid";


	const columnExplicitTrackList = ref<ExplicitTrackList>([
		{trackSize: 'auto'},
		{trackSize: 'auto'},
		{trackSize: 'auto'},
		{trackSize: 'auto', lineNames: '[boris-start]'},
		{trackSize: 'auto'},
		{trackSize: '', lineNames: '[boris-end]'}
	]);
	const userColumnExplicitTrackList = computed(() => columnExplicitTrackList.value.slice(1, length - 1) as OneOrMore<ExplicitTrack>);

	const rowTracks = ref<OneOrMore<ExplicitRowTrackObj>>([
		{
			lineNamesStart: '[boris-start]',
			trackSize: 'auto',
			areas: ['.', ...Array.from({length: columnExplicitTrackList.value.length - 2}, ()=> ('labels-column'))],
			lineNamesEnd: '[boris-end]'
		},
		{
			lineNamesStart: '',
			trackSize: 'auto',
			areas: ['labels-row','first', 'first', '.', '.'],
			lineNamesEnd: '',
		},
		{
			lineNamesStart: '[a-really-long-line-name-]',
			trackSize: 'auto',
			areas: ['labels-row','bob', 'bob', 'bob', 'bob'],
			lineNamesEnd: '',
		}
	]);

	const userRowTracks = computed({
		get: () => rowTracks.value.slice(1).map(({lineNamesStart, areas, trackSize, lineNamesEnd}) => ({
			lineNamesStart,
			areas: areas.slice(1),
			trackSize,
			lineNamesEnd
		})) as OneOrMore<ExplicitRowTrackObj>,
		set: newValue => {
			
			rowTracks.value = [
			rowTracks.value[0],
			...newValue.map(({lineNamesStart, areas, trackSize, lineNamesEnd}) => ({
			lineNamesStart,
			areas: ['labels-row', ...areas],
			trackSize,
			lineNamesEnd
		})) as OneOrMore<ExplicitRowTrackObj>
		];
		}
	});

	const gridAreas = computed(() => Array.from(new Set(userRowTracks.value.flatMap(({areas}) => areas).filter(area => area !== '.'))));
	const areaItems = computed(() => gridAreas.value.map(area => ({area, color: getRandomColor()})));
	const template = computed( () => `
${rowTracks.value.map(serializeTrack).join('\n')}
/ ${serializeExplicitTrackList(columnExplicitTrackList.value)}
	`);

	const userTemplate = computed( () => `
${userRowTracks.value.map(serializeTrack).join('\n')}
/ ${serializeExplicitTrackList(columnExplicitTrackList.value.slice(1, -1) as ExplicitTrackList)}
	`);
</script>

<template>
	<div 
		class="grid-wrapper" 
		:style="{
			'grid-template': template,
		}"
	>
		
		<GridHeadColumn :explicit-track-list="userColumnExplicitTrackList"/>
		<GridHeadRow v-model:explicit-track-list="userRowTracks"/>

		<div class="grid-container">
			<GridItem
				v-for="item in areaItems"
				:item="item"
			/>
			<div class="boris"></div>
		</div>
	</div>

	<pre class="copiable">
grid-template: {{ userTemplate }}
	</pre>
</template>

<style scoped lang="scss">
	.grid-wrapper {
		display: grid;
	}
	.grid-container {
		width: 100%;
		height: 100%;
		
		border: 1px solid black;

		display: grid;
		overflow: auto;
		grid-area: 2/2/-1/-1;
		grid-template-rows: subgrid;
		grid-template-columns: subgrid;

		// resize: both;

	}
	.boris{
		grid-area: boris;
	}

	.copiable {
		text-align: left;
	}
</style>

