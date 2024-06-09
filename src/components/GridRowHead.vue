<script setup lang="ts">
import { computed } from 'vue';
import { LineNames, TrackSize } from './grid';


const name = defineModel<LineNames>('name');
const width = defineModel<TrackSize | ''>('width');

const id = crypto.randomUUID();
</script>

<template>
	<label :for="id" class="grid-row-head">
		<span class="track" tabindex="0" :style="{visibility: name ? 'visible' : 'hidden'}">|<span class="tooltip">{{name}}</span></span>
		<div class="label-text">
			collumn width 
		</div>
		<input 
			type="text"
			:id="id"
			v-model="width"
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