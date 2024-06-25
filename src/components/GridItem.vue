<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import { Coord, useMousePosition } from '../stores/mouse-position.store';
import { GridArea, containerSymbol } from '../types/grid.type';
import { Interaction } from '../types/interaction.type';

	const item = defineModel<GridArea>('item', {required: true});


	// #region resize interaction
	const handles = [
		'top-left', 
		'top-right', 
		'bottom-left', 
		'bottom-right'
		] as const;
	type HandleName = typeof handles[number];

	const isResizing = ref(false);
	const activeHandle = ref<HandleName|null>(null);
	const mousePosition = useMousePosition();
	
	const resizeInteraction = {
		start: (_, handleName) => {
			isResizing.value = true;
			activeHandle.value = handleName;
			bufferItem.value = {...item.value};
		},
		perform: () => {
			// is the current item interacted with ?
			if (!isResizing.value || activeHandle.value === null || bufferItem.value === null) {
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
		},
		finish: () => {
			isResizing.value = false;
			activeHandle.value = null;
			if (bufferItem.value !== null) {
				item.value = bufferItem.value;			
			}
			bufferItem.value = null;	
		}
	} as const satisfies Interaction<HandleName>;


	const container = inject(containerSymbol);

	onMounted(() => {
		const containerElement = container!.value;

		containerElement.addEventListener('mousemove', resizeInteraction.perform);
		document.addEventListener('mouseup', resizeInteraction.finish);
		
	})

	onUnmounted(() => {
		const containerElement = container!.value;

		containerElement.removeEventListener('mousemove', resizeInteraction.perform);
		document.removeEventListener('mouseup', resizeInteraction.finish);
	})

	function isActive(handleName: HandleName): boolean {
		return handleName === activeHandle.value;
	}
	// #endregion


	// #region move interaction
	const mouseStartPosition = ref<Coord|null>(null);
	const isMoving = ref(false);

	const moveInteraction = {
		start: () => {
			isMoving.value = true;
			mouseStartPosition.value = mousePosition.lastValidPosition;
			bufferItem.value = {...item.value};
		},
		perform: () => {
			if (!isMoving.value || mouseStartPosition.value === null || bufferItem.value === null) {
				return;
			}
			const delta = {
				x: mousePosition.lastValidPosition.x - mouseStartPosition.value.x,
				y: mousePosition.lastValidPosition.y - mouseStartPosition.value.y,
			};

			const buffer = bufferItem.value;

			buffer.columnStart = item.value.columnStart + delta.x;
			buffer.columnEnd = item.value.columnEnd + delta.x;
			buffer.rowStart = item.value.rowStart + delta.y;
			buffer.rowEnd = item.value.rowEnd + delta.y;
		},
		finish: () => {
			isMoving.value = false;
			if (bufferItem.value !== null) {
				item.value = bufferItem.value;			
			}
			bufferItem.value = null;			
		}
	} as const satisfies Interaction;

	onMounted(() => {
		const containerElement = container!.value;

		containerElement.addEventListener('mousemove', moveInteraction.perform);
		document.addEventListener('mouseup', moveInteraction.finish);
	})

	onUnmounted(() => {
		const containerElement = container!.value;

		containerElement.removeEventListener('mousemove', moveInteraction.perform);
		document.removeEventListener('mouseup', moveInteraction.finish);
	})

	// #region
	
	const bufferItem = ref<GridArea|null>(null);
	const area = computed(() => {
		const target = bufferItem.value ?? item.value;
		return `${target.rowStart}/${target.columnStart}/${target.rowEnd}/${target.columnEnd}`;
	});

</script>

<template>
	<div 
		v-bind="$attrs"
		class="grid-area"
		:style="{
			'--forground': item.color,
			'grid-area': item.area
		}"
		@mousedown="moveInteraction.start"
	>
		<span class="area-name">
			{{ item.area }}
		</span>
		
		<div 
			v-for="handle in handles"
			@mousedown.stop="resizeInteraction.start($event, handle)"
			:class="[{
				active: isActive(handle)
			}, handle]"
			class="resize-handle"
		></div>
	</div>
	<div 
		class="grid-item"
		v-if="bufferItem !== null"
		:style="{
			'--forground': item.color,
			'grid-area': area
		}"
	></div>
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

		--handle-size: minmax(auto, 15px);
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
		border: 2px solid red;
	}
</style>