<script setup lang="ts">
	const model = defineModel<boolean>({default: false});

	const uuid = crypto.randomUUID();
</script>

<template>
	<li>
		<label
			:for="uuid"
		><slot>[PH] Setting Label</slot></label>
		<input 
			:id="uuid"
			type="checkbox"
			v-model="model"
		>
	</li>
</template>

<style scoped lang="scss">
	
</style>