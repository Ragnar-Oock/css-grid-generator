<script setup lang="ts">
import { incrementString } from '../../helper/incrementable-string.helper';
import { LineNames, TrackSize } from '../../types/grid.type';


const name = defineModel<LineNames>('name');
const width = defineModel<TrackSize|''>('width', {required: true});


const id = crypto.randomUUID();

function incrementValue(increment: number) {
	width.value = incrementString(width.value, increment, 0);
}

</script>

<template>
	<div class="column-track">
		<span 
			class="name"
			tabindex="0"
			:style="{visibility: name ? 'visible' : 'hidden'}"
			v-tippy="{content: name}"
			>|</span>
			<input 
				class="size"
				placeholder="auto"
				type="text"
				:id="id"
				v-model="width"
				
				aria-label="column width"
	
				@keydown.up.exact="incrementValue(1)"
				@keydown.down.exact="incrementValue(-1)"
				@keydown.up.shift="incrementValue(0.1)"
				@keydown.down.shift="incrementValue(-0.1)"
				@keydown.up.alt="incrementValue(10)"
				@keydown.down.alt="incrementValue(-10)"
			>
	</div>
</template>

<style scoped lang="scss">
.column-track{
	display: grid;
	grid-template:
		'name size' auto
	/ var(--gap) calc(100%);
	
	transform: translateX(calc(var(--gap) * -1));

	.name {
		grid-area: name;
		background-color: lime;
	}
	.size {
		grid-area: size;
		min-width: unset;
		border: none;
		padding: none;
		background-color: transparent;
		font-family: monospace;
		color: var(--text-color);

		&:focus {
			outline: none;
			color: #b0b;
		}
	}
}
</style>