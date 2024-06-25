<script setup lang="ts">
import { useDebug } from '../../stores/debug.store';
import SettingToggle from './SettingToggle.vue'

	
	const debug = useDebug();

</script>

<template>
	<div class="settings">
		<ul>
			<SettingToggle v-model="debug.showGap">Show the grid-gap</SettingToggle>
			<SettingToggle v-model="debug.showHovered">Show Hovered rows and columns</SettingToggle>
			<SettingToggle v-model="debug.showMousePosition">Show the resolved mouse position</SettingToggle>
			<SettingToggle v-model="debug.showKeyPress">Show key presses</SettingToggle>
		</ul>
	</div>
</template>

<style scoped lang="scss">
	
</style>