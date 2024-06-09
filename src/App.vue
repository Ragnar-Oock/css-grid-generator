<script setup lang="ts">
	import { ref } from "vue";
import GridContainer from "./components/GridContainer.vue";
import { Area, Item } from "./components/grid";

	const items = ref<Item[]>([
		{
			area: 'area-1',
			color: '#ff00ff',
		}
	]);
	const template = ref(`
	'top top top' 64px
	'. area-1 .' 1fr
	'bottom bottom bottom' 85px
	/ 1fr auto 1fr
	`);
	const areas = ref<Area[]>([])



</script>

<template>
	<GridContainer
	/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
