<script setup lang="ts">
	import { useMousePosition } from "../../stores/mouse-position.store";
	import { useDebug } from "../../stores/debug.store";
	
	// #region debug
	const mousePosition = useMousePosition();
	const debug = useDebug();
	// #endregion
	
</script>

<template>
	<pre class="mouse-pos" v-if="debug.showMousePosition">
real : [{{ mousePosition.gridCoords.x }}, {{ mousePosition.gridCoords.y }}]
valid : [{{ mousePosition.lastValidPosition.x }}, {{ mousePosition.lastValidPosition.y }}]
	</pre>
</template>

<style scoped lang="scss">
	.mouse-pos {
		grid-area: 1/1/2/2;
	}
</style>