<script setup lang="ts">
import { Item } from './grid';

	const props = defineProps<{
		item: Item
	}>()


</script>

<template>
	<div 
		class="grid-item"
		:style="{
			'--forground': item.color,
			'grid-area': item.area
		}">
		<span class="area-name">
			{{ item.area }}
		</span>
	</div>
</template>

<style scoped lang="scss">
	.grid-item {
		border: 1px solid color-mix(in srgb, var(--forground) 80%, transparent 20%);
		color: var(--forground);
		background-color: color-mix(in hsl shorter hue, var(--forground) 25%, transparent 75%);
		border-radius: 4px;
		overflow: visible;

		display: grid;
		place-items: center;

		--area-name-forground: #333;
		--area-name-background: #fff;

		.area-name {
			background: var(--area-name-background);
			color: var(--area-name-forground);
			padding: .125em .25em;
			border-radius: 2px;
		}
	}
</style>