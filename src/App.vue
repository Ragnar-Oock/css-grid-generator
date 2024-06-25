<script setup lang="ts">
	import { ref } from "vue";
import GridContainer from "./components/GridContainer.vue";
	import SettingsPanel from "./components/settings/SettingsPanel.vue";
import { useDebug } from "./stores/debug.store";

	const pressed = ref('');

	addEventListener('keydown', event => {
		pressed.value = `${event.ctrlKey ? '[ctrl]+' : ''}${event.shiftKey ? '[shift]+' : ''}${event.altKey ? '[alt]+':''}${event.key !== '' ? '['+event.key+']' :''}`
	})
	addEventListener('keyup', () => setTimeout(() => {
		pressed.value = '';
	}, 300))

	const debug = useDebug();

</script>

<template>
	<SettingsPanel></SettingsPanel>
	<GridContainer/>
	<div class="keypress" v-if="debug.showKeyPress">
		{{pressed}}
	</div>
</template>

<style scoped>
.keypress {
	position: absolute;
}
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
