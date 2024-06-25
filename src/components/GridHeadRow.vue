<script setup lang="ts">
import { ExplicitRowTrackObj } from '../types/grid.type';
import { OneOrMore } from '../types/helper.type';
import GridRowHead from './GridRowHead.vue';

	const explicitTrackList = defineModel<OneOrMore<ExplicitRowTrackObj>>('explicitTrackList', {default: []});

	const emit = defineEmits<{
		'update:explicit-track-list': OneOrMore<ExplicitRowTrackObj>[]
	}>()

	function updateTrack(): void {
		emit('update:explicit-track-list', explicitTrackList.value)
	}
</script>

<template>
	<div class="grid-head-row">
		<GridRowHead
			v-for="(explicitTrack, index) in explicitTrackList"
			:style="{
				'grid-row': `span 1 / ${index + 2}`
			}"
			v-model:width="explicitTrack.trackSize"
			@update:width="updateTrack()"
		/>
	</div>
</template>

<style scoped lang="scss">
	.grid-head-row {
		display: grid;
		grid-template-rows: subgrid;
		grid-area: labels-row;
		position: sticky;
		left:0;
		background-color: var(--app-background-color);
	}
</style>