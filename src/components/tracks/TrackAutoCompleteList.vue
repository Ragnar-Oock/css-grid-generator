<script setup lang="ts">
import { computed } from 'vue';
import { TrackSize } from '../../types/grid.type';
import { LenghtUnit } from '../../types/css.type';

	const props = defineProps<{
		id: string;
		value: TrackSize;
	}>()

	const widthNumbers = computed(() => /^(-?\d+(?:\.\d+)?)/.exec(props.value)?.[0] ?? null);
	const completeUnits = computed(() => {
		const width = widthNumbers.value;
		if (width == null) {
			return []
		}
		return LenghtUnit.map(unit => `${width}${unit}`);
	})
</script>

<template>
	<datalist 
			:id="'list'+id"
		>
			<option value="auto"></option>
			<option value="min-content"></option>
			<option value="max-content"></option>
			<option value="fit-content()"></option>
			<option value="minmax()"></option>
			<option value="var()"></option>

			<option v-for="unit in completeUnits" :value="unit"></option>

		</datalist>
</template>

<style scoped lang="scss">
	
</style>