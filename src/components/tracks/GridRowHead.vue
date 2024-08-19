<script setup lang="ts">
import { incrementString } from '../../helper/incrementable-string.helper';
import { TrackSize } from '../../types/grid.type';


const width = defineModel<TrackSize>('width', {required: true});

const id = crypto.randomUUID();

function incrementValue(increment: number) {
	width.value = incrementString(width.value, increment, 0);
}
</script>

<template>
	<label :for="id" class="grid-row-head">
		<input
			placeholder="auto"
			type="text"
			:id="id"
			v-model="width"
			:list="'list'+id"
			aria-label="row height"
			@keydown.up.exact="incrementValue(1)"
			@keydown.down.exact="incrementValue(-1)"
			@keydown.up.shift="incrementValue(0.1)"
			@keydown.down.shift="incrementValue(-0.1)"
			@keydown.up.alt="incrementValue(10)"
			@keydown.down.alt="incrementValue(-10)"
		>
	<datalist 
		:id="'list'+id"
	>
		<option value="auto"></option>
		<option value="min-content"></option>
		<option value="max-content"></option>
		<option value="fit-content()"></option>
		<option value="minmax()"></option>
		<option value="var()"></option>

	</datalist>
	</label>
</template>

<style scoped lang="scss">
	.grid-row-head {
		display: grid;
		grid-template: 
			'track' auto
			'input' 1fr
		/ auto;
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