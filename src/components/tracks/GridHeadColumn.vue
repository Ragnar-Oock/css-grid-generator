<script setup lang="ts">
import { computed } from 'vue';
import { ExplicitTrack, ExplicitTrackList } from '../../types/grid.type';
import { OneOrMore } from '../../types/helper.type';
import GridColumnHead from "./GridColumnHead.vue";

	const props = defineProps<{
		explicitTrackList: ExplicitTrackList;
	}>();

	const editableColumns = computed(() => props.explicitTrackList.slice(0, -1) as OneOrMore<ExplicitTrack>);
 
</script>

<template>
	<div class="grid-head-column">
		<GridColumnHead
			v-for="(explicitTrack, index) in editableColumns"
			v-model:name="explicitTrack.lineNames"
			v-model:width="explicitTrack.trackSize"
		/>
	</div>
</template>

<style scoped lang="scss">
	.grid-head-column {
		display: grid;
		grid-template-rows: subgrid;
		grid-template-columns: subgrid;
		grid-area: labels-column;
		background-color: var(--app-background-color);
	}
</style>