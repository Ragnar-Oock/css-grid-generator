<script setup lang="ts">
import { ExplicitTrack, OneOrMore } from './grid';
import GridColumnHead from "./GridColumnHead.vue";

	const prop = defineProps<{
		explicitTrackList: OneOrMore<ExplicitTrack>;
	}>();

 
</script>

<template>
	<div class="grid-head-column">
		<GridColumnHead
			v-for="(explicitTrack, index) in explicitTrackList"
			:style="{
				'grid-column': `${index + 1} / span 1`
			}"
			v-model:name="explicitTrack.lineNames"
			v-model:width="explicitTrack.trackSize"
		/>
	</div>
</template>

<style scoped lang="scss">
	.grid-head-column {
		display: grid;
		grid-template-columns: subgrid;
		grid-area: labels-column;
		position: sticky;
		top: 0;
		background-color: var(--app-background-color);
	}
</style>