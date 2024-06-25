<script setup lang="ts">
import { incrementString } from '../helper/incrementable-string.helper';
import { LineNames, TrackSize } from '../types/grid.type';


const name = defineModel<LineNames>('name');
const width = defineModel<TrackSize>('width', {required: true});

const id = crypto.randomUUID();

function incrementValue(increment: number) {
	width.value = incrementString(width.value, increment, 0);
}
</script>

<template>
	<label :for="id" class="grid-row-head">
		<span class="track" tabindex="0" :style="{visibility: name ? 'visible' : 'hidden'}">|<span class="tooltip">{{name}}</span></span>
		<div class="label-text">
			row height 
		</div>
		<input 
			type="text"
			:id="id"
			v-model="width"
			@keydown.up.exact="incrementValue(1)"
			@keydown.down.exact="incrementValue(-1)"
			@keydown.up.shift="incrementValue(0.1)"
			@keydown.down.shift="incrementValue(-0.1)"
			@keydown.up.alt="incrementValue(10)"
			@keydown.down.alt="incrementValue(-10)"
		>
	</label>
</template>

<style scoped lang="scss">
	.grid-row-head {
		display: grid;
		grid-template: 
			'track label' auto
			'. input' auto
		/ auto 1fr;
		.label-text {
			grid-area: label;
			transition: opacity 300ms ease-in-out;
			opacity: 0.4;
		}
		input {
			grid-area: input;
		}

		&:focus-within .label-text {
			opacity: 1;
		}

		.track {
			grid-area: track;
			position: relative;
			display: inline block;
			aspect-ratio: 1 / 1;
			background-color: #fff;
			color: red;
			.tooltip {
				position: absolute;
				bottom: 100%;
				transform: translate(-50%);
				width: max-content;
				background-color: #fff;
				opacity: 0;
				transition: opacity 300ms ease-in-out;
			}
			&:hover,
			&:focus {
				.tooltip {
					opacity: 1;
				}
			}
		}
	
	}
</style>