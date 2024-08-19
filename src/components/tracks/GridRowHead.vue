<script setup lang="ts">
import { computed } from 'vue';
import { isTrackBreadth } from '../../helper/css-validator.helper';
import { incrementString } from '../../helper/incrementable-string.helper';
import { TrackSize } from '../../types/grid.type';
import BorderlessInput from "../inputs/borderless-input.vue";


const width = defineModel<TrackSize | ''>('width', {required: true});

const validatedModel = computed({
	get() {
		return width.value;
	},
	set(value) {
		if (isTrackBreadth(value)) {
			width.value = value;
		}
	}
})

const id = crypto.randomUUID();

function incrementValue(increment: number) {
	validatedModel.value = incrementString(validatedModel.value, increment, 0);
}
</script>

<template>
	<label :for="id" class="grid-row-head">
		<BorderlessInput
			placeholder="auto"
			type="text"
			:id="id"
			v-model="validatedModel"
			:list="'list'+id"
			aria-label="row height"
			@keydown.up.exact="incrementValue(1)"
			@keydown.down.exact="incrementValue(-1)"
			@keydown.up.shift="incrementValue(0.1)"
			@keydown.down.shift="incrementValue(-0.1)"
			@keydown.up.alt="incrementValue(10)"
			@keydown.down.alt="incrementValue(-10)"
		/>
	<datalist 
		:id="'list'+id"
	>
		<option value="auto"></option>
		<option value="min-content"></option>
		<option value="max-content"></option>
		<option value="fit-content()"></option>
		<option value="minmax()"></option>
		<option value="var(--)"></option>

	</datalist>
	</label>
</template>

<style scoped lang="scss">
	.grid-row-head {
		display: grid;
		grid-template: 
			'track' auto
			'input' 1fr
		/ 100%;
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