<script setup lang="ts">
	import { computed } from 'vue';
	import { ExplicitRowTrackState, ExplicitTrackList, OneOrMore } from './grid';

	const props = defineProps<{
		rows: OneOrMore<ExplicitRowTrackState>;
		cols: ExplicitTrackList;
	}>()

	const rowFillers = computed(() => {
		return props.rows.map((_, index) => `${index + 1} / span 1`)
	})

	const colFillers = computed(() => {
		return props.cols.slice(2).map((_, index) => `${index + 1} / span 1`)
	})
</script>

<template>
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
</template>

<style scoped lang="scss">
	
</style>