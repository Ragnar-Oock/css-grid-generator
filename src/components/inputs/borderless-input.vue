<script setup lang="ts">
	const model = defineModel()
</script>

<template>
	<input
		type="text"
		v-bind="$attrs"
		class="borderless"
		v-model="model"
	>
</template>

<style scoped lang="scss">
	.borderless {
		--input-foreground: var(--text-color);
		--input-foreground-hover: #bb00bb88;
		--input-foreground-focus: #b0b;

		--input-placeholder: #333333;


		min-width: unset;
		border: none;
		padding: none;
		background-color: transparent;
		font-family: monospace;
		color: var(--text-color);

		&:focus {
			outline: none;
			color: var(--input-foregroud-focused);
			background-color: var(--input-background-focused);
		}
	}
</style>