<script setup lang="ts">
	import { computed, provide, ref } from "vue";
	import { getRandomColor } from "../helper/color.helper";
	import { serializeExplicitTrackList, serializeTrack } from "../helper/css-normalize";
	import GridHeadColumn from "./GridHeadColumn.vue";
	import GridHeadRow from "./GridHeadRow.vue";
	import GridItem from './GridItem.vue';
	import { ExplicitTrack, OneOrMore, containerSymbol, type ExplicitRowTrackObj, type ExplicitTrackList } from "./grid";


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
			areas: ['labels-row','.', 'first', 'first', '.'],
			lineNamesEnd: '',
		},
		{
			lineNamesStart: '',
			trackSize: 'auto',
			areas: ['labels-row','bob', 'bob', 'bob', 'bob'],
			lineNamesEnd: '',
		}
	]);

	const rowFillers = computed(() => {
		return Array
			.from({length: rowTracks.value.length -1 }, (_, index) => `${index + 1} / span 1`);
	})

	const colFillers = computed(() => {
		return Array.from({length: columnExplicitTrackList.value.length - 2}, (_, index) => `${index + 1} / span 1`);
	})

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
/ ${serializeExplicitTrackList(columnExplicitTrackList.value.slice(1) as ExplicitTrackList)}
	`);

	const container = ref<HTMLElement>();


	provide(containerSymbol, container);
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

		<div class="grid-container">
			<div class="devtools">
				<div
					class="grid-row gap-filler"
					v-for="filler in rowFillers"
					:style="{
						'grid-row': filler
					}"
				></div>
			</div>
			<div class="devtools">
				<div
					class="grid-col gap-filler"
					v-for="filler in colFillers"
					:style="{
						'grid-column': filler
					}"
				></div>
			</div>

			<GridItem
				v-for="item in areaItems"
				:item="item"
			/>
		</div>
	</div>

	<pre class="copiable">
grid-template: {{ userTemplate }}
	</pre>

	<pre class="copiable">
actual grid-template : {{template}}
	</pre>
</template>

<style lang="scss">
	.grid-wrapper {
		display: grid;
		--gap: .5rem;
		gap: var(--gap);

	}
	.grid-container {
		width: 100%;
		height: 100%;
		
		border: 1px solid black;

		display: grid;
		overflow: hidden;
		grid-area: 2/2/-1/-1;
		grid-template-rows: subgrid;
		grid-template-columns: subgrid;

		// resize: both;


		.devtools {
			display: contents;
			pointer-events: none;
			
			.grid-row {
				grid-column: 1 / -1;
				&::after {
					inset: 100% 0 calc(var(--gap) * -1) 0;
				}
			}
			.grid-col {
				grid-row: 1 / -1;
				&::after {
					inset: 0 calc(var(--gap) * -1) 0 100%;
				}
			}

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

					background: linear-gradient(
						-45deg, 
						var(--gap-color-1) 5%,
						var(--gap-color-2) 5%, var(--gap-color-2) 50%,
						var(--gap-color-1) 50%, var(--gap-color-1) 55%, 
						var(--gap-color-2) 55%
					) 0 / var(--gradient-size) var(--gradient-size);
				}
		}
	}
	.boris{
		grid-area: boris;
	}

	.copiable {
		text-align: left;
	}
</style>

