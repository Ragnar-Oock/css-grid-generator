import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getRandomColor } from "../helper/color.helper";
import { ExplicitRowTrackState, ExplicitTrackList, GridArea } from "../types/grid.type";
import { OneOrMore } from "../types/helper.type";

export const useGrid = defineStore('grid', () => {

	// #region areas
	const areas = ref<GridArea[]>([
		{
			area: 'bob',
			color: getRandomColor(),
			columnStart: 2,
			columnEnd: 3,
			rowStart: 1,
			rowEnd: 2
		}
	]);

	function updateItem(name: string, newItem: GridArea): void {
		const index = areas.value.findIndex(({area}) => area === name)
		if (index === -1) {
			return;
		}

		areas.value[index] = newItem;
	}

	// #endregion

	// #region columns
	const columns = ref<ExplicitTrackList>([
		{trackSize: '20%'},
		{trackSize: '1fr'},
		{trackSize: '25px'},
		{trackSize: '20vw', lineNames: '[boris-start]'},
		{lineNames: '[boris-end]'}
	]);

	const numberOfColumns = computed(() => columns.value.length - 1);
	// #endregion

	// #region rows
	
	const rows = ref<OneOrMore<ExplicitRowTrackState>>([
		{
			lineNamesStart: '[boris-start]',
			trackSize: 'auto',
			lineNamesEnd: '[boris-end]'
		},
		{
			lineNamesStart: '',
			trackSize: 'auto',
			lineNamesEnd: '',
		},
		{
			lineNamesStart: '',
			trackSize: 'auto',
			lineNamesEnd: '',
		},
		{
			lineNamesStart: '',
			trackSize: 'auto',
			lineNamesEnd: '',
		}
	]);
	
	const numberOfRows = computed(() => rows.value.length);
	// #endregion

	return {
		areas,
		updateItem,

		columns,
		numberOfColumns,

		rows,
		numberOfRows
	}

});