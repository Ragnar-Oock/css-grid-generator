<script setup lang="ts">
import { computed } from 'vue';
import { ExplicitTrackList } from '../types/grid.type';
import GridColumnHead from "./GridColumnHead.vue";

	const props = defineProps<{
		explicitTrackList: ExplicitTrackList;
	}>();

	const editableColumns = computed(() => props.explicitTrackList.slice(0, -1));
 
</script>

<template>
	<div class="grid-head-column">
		<GridColumnHead
			v-for="(explicitTrack, index) in editableColumns"
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