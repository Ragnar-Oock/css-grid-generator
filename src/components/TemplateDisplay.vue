<script setup lang="ts">
	const props = defineProps<{
		label: string;
		template: string;
	}>()
</script>

<template>
	<div class="template">
		<label for="uuid" class="label">
			{{ label }}
		</label>
		<output id="uuid">
			{{ pretty }}
		</output>
	</div>
</template>

<style scoped lang="scss">
	
</style>