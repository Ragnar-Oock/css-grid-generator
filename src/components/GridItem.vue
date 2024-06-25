<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import { useMousePosition } from '../stores/mouse-position.store';
import { GridArea, containerSymbol } from './grid';

	const item = defineModel<GridArea>('item', {required: true});
	const handles = [
	'top-left', 
	'top-right', 
	'bottom-left', 
	'bottom-right'
	] as const;

	type HandleName = typeof handles[number];


	const activeHandle = ref<HandleName|null>(null);

	function onMouseDown(event: MouseEvent, handleName: HandleName): void {
		activeHandle.value = handleName;
		bufferItem.value = {...item.value};
	}


	const mousePosition = useMousePosition();

	const bufferItem = ref<GridArea|null>(null);
	
	function onMouseMove(event: MouseEvent): void {
		// is the current item interacted with ?
		if (activeHandle.value === null || bufferItem.value === null) {
			return;
		}

		const {x, y} = mousePosition.lastValidPosition;
		const {rowStart, rowEnd, columnStart, columnEnd} = item.value;
		const buffer = bufferItem.value;

		if (activeHandle.value.includes('top')) {
			if (y < rowEnd) {
				buffer.rowStart = y;
			}
			if (rowEnd <= y + 1) {
				buffer.rowEnd = y + 1;
			}
		}

		if (activeHandle.value.includes('bottom')) {
			if (y <= rowStart) {
				buffer.rowStart = y;
			}
			if (rowStart < y + 1) {
				buffer.rowEnd = y + 1;
			}
		}

		if (activeHandle.value.includes('left')) {
			if (x < columnEnd) {
				buffer.columnStart = x;
			}
			if (columnEnd <= x + 1) {
				buffer.columnEnd = x + 1;
			}		
		}

		if (activeHandle.value.includes('right')) {
			if (x <= columnStart) {
				buffer.columnStart = x;
			}
			if (columnStart < x + 1) {
				buffer.columnEnd = x + 1;
			}		
		}


	}

	function onMouseUp(event: MouseEvent) {
		activeHandle.value = null;
		if (bufferItem.value !== null) {
			item.value = bufferItem.value;			
		}
		bufferItem.value = null;		
	}

	const container = inject(containerSymbol);

	onMounted(() => {
		const containerElement = container!.value;

		containerElement.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
		
	})

	onUnmounted(() => {
		const containerElement = container!.value;

		containerElement.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', onMouseUp);
	})

	function isActive(handleName: HandleName): boolean {
		return handleName === activeHandle.value;
	}

	const area = computed(() => {
		const target = bufferItem.value ?? item.value;
		return `${target.rowStart}/${target.columnStart}/${target.rowEnd}/${target.columnEnd}`;
	});

</script>

<template>
	<div 
		class="grid-area"
		:style="{
			'--forground': item.color,
			'grid-area': item.area
		}">
		<span class="area-name">
			{{ item.area }}
		</span>
		
		<div 
			v-for="handle in handles"
			@mousedown="onMouseDown($event, handle)"
			:class="[{
				active: isActive(handle)
			}, handle]"
			class="resize-handle"
		></div>
	</div>
	<div 
		class="grid-item"
		:class="{
			active: activeHandle !== null
		}"
		:style="{
			'--forground': item.color,
			'grid-area': area
		}"
	>		
	</div>
</template>

<style scoped lang="scss">
	.grid-area {
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
	.grid-item{
		pointer-events: none;
		&.active {
			// background-color: color-mix(in hsl shorter hue, var(--forground) 15%, transparent 85%);

			border: 2px solid red;
		}
	}
</style>

<!-- 
if top left on the left of col end
  update colstart
if top left on the right of col end
  update colend
if top left above rowend
  update rowstart
if top left belore rowend
	update rowend
-->