<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from 'vue';
import { Item, containerSymbol } from './grid';

	const props = defineProps<{
		item: Item
	}>()
	const handles = [
	'top-left', 
	'top-right', 
	'bottom-left', 
	'bottom-right'
	] as const;

	type HandleName = typeof handles[number];


	const activeHandle = ref<HandleName|null>(null);

	function ondragstart(event: DragEvent, handleName: HandleName): void {
		activeHandle.value = handleName;
		console.log(`start : ${handleName}`);
	}

	function onDragOver(event: DragEvent): void {
		// is the current item interacted with ?
		if (activeHandle.value === null) {
			return;
		}

		console.log(`over : ${activeHandle.value}`);
	}

	function onDragEnd(event: DragEvent) {
		activeHandle.value = null;
		console.log(`end : ${activeHandle.value}`);
		
	}

	const container = inject(containerSymbol);

	onMounted(() => {
		const containerElement = container!.value;

		containerElement.addEventListener('dragover', onDragOver);
		containerElement.addEventListener('dragend', onDragEnd)
		
	})

	onUnmounted(() => {
		const containerElement = container!.value;

		containerElement.removeEventListener('dragover', onDragOver);
		containerElement.removeEventListener('dragend', onDragEnd);
	})

	function isActive(handleName: HandleName): boolean {
		return handleName === activeHandle.value;
	}

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
		
		<div 
			v-for="handle in handles"
			@dragstart="ondragstart($event, handle)"
			:class="[{
				active: isActive(handle)
			}, handle]"
			draggable="true"
			class="resize-handle"
		></div>

	</div>
</template>

<style scoped lang="scss">
	.grid-item {
		--border-radius: 4px;

		border: 1px solid color-mix(in srgb, var(--forground) 80%, transparent 20%);
		color: var(--forground);
		background-color: color-mix(in hsl shorter hue, var(--forground) 25%, transparent 75%);
		border-radius: var(--border-radius);
		overflow: visible;

		display: grid;

		grid-template:
		[name-start] 	'top-left . top-right' var(--handle-size)
									'. . .' 1fr
				          'bottom-left . bottom-right' var(--handle-size) [name-end] 
								/ [name-start] var(--handle-size) 1fr var(--handle-size) [name-end];

		--area-name-forground: #333;
		--area-name-background: #fff;

		.area-name {
			grid-area: name;
			background: var(--area-name-background);
			color: var(--area-name-forground);
			padding: .125em .25em;
			border-radius: 2px;
			place-self: center;
		}

		--handle-size: 15px;
		.resize-handle {
			background: #fafafa;

			&.active {
				background-color: lime;
			}
	

			&.top-left {
				grid-area: top-left;
				border-radius: var(--border-radius) 0;
			}
			&.top-right {
				grid-area: top-right;
				border-radius: 0 var(--border-radius);
			}
			&.bottom-right {
				grid-area: bottom-right;
				border-radius: var(--border-radius) 0;
			}
			&.bottom-left {
				grid-area: bottom-left;
				border-radius: 0 var(--border-radius);
			}
		}
	}
</style>