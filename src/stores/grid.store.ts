import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getAreaByCell, getAreaIndex, isOverlaping } from "../helper/area.helper";
import { makeGrid } from "../helper/array.helper";
import { getRandomColor } from "../helper/color.helper";
import { isString } from "../helper/type.helper";
import { ExplicitRowTrackState, ExplicitTrackList, GridArea, LineNames, TrackSize } from "../types/grid.type";
import { OneOrMore } from "../types/helper.type";

export const useGrid = defineStore('grid', () => {

	// #region columns

	/**
	 * holds the "width" of the column tracks, there's always at least one item in this array
	 */
	const columnTracks = ref<OneOrMore<TrackSize>>([
		'20%',
		'1fr',
		'50px',
		'10rem',
		'auto',
	]);
	type Tracknames = string[];
	type TracknamesList = [Tracknames, Tracknames, ...Tracknames[]];

	/**
	 * holds the user provided names for each column lines, this array should always be 1 item
	 * longer than columnTracks because there's a line on each side of every track
	 */
	const userColumnLineNames = ref<TracknamesList>([
		[],
		[],
		[],
		[],
		['boris-start'],
		['boris-end'],
	]);

	function formatLineNames(lineNames: Tracknames): LineNames | undefined {
		return lineNames.length === 0 ? undefined : `[${lineNames.join(' ')}]`;
	}

	const areaByCells = computed(() => {
		const areaList = areas.value;
		return Array.from(
			{length: userColumnLineNames.value.length},
			(_, columnLineIndex) => Array.from(
				{length: numberOfRows.value + 1},
				(_, rowLineIndex) => getAreaByCell(areaList, columnLineIndex, rowLineIndex)
			)
		)}
	)

	const numberOfColumns = computed(() => userColumnLineNames.value.length - 1);

	/**
	 * finds all the areas that are starting or ending at the given line and add their 
	 * name to the line names if the area is overlaping another one and can't be put 
	 * in the area string
	 * 
	 * @param columnLineIndex index of the column line (1 indexed)
	 */
	function columnLineNamesFromAreas(columnLineIndex: number): Tracknames {
		const areaArray = Array.from(grid2d.value[1]);
		return [
				...areaArray
					.filter(({columnStart}) => columnStart === columnLineIndex)
					.map(({area}) => `${area}-start`),
				...areaArray
					.filter(({columnEnd}) => columnEnd === columnLineIndex)
					.map(({area}) => `${area}-end`),
			]
			.filter(isString)
	}

	const columns = computed<ExplicitTrackList>(() => 
			userColumnLineNames
				.value
				.map((userLineNames, index) => ({
					lineNames: formatLineNames([...userLineNames, ...columnLineNamesFromAreas(index + 1)]),
					trackSize: columnTracks.value[index] ?? 'auto'
				})) as ExplicitTrackList,
		);

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

	// #region areas

	const grid2d = computed<[cells: (GridArea|null)[][], overlaping: GridArea[]]>(() => {
		const nbCols = numberOfColumns.value;
		const nbRows = numberOfRows.value;
		let allAreas: GridArea[] = Array
			.from(areas.value)
			.sort((a, b) => getAreaIndex(a, nbCols) - getAreaIndex(b, nbCols));
		let overlaping: GridArea[] = []; 
		let noOverlap: GridArea[] = Array.from(allAreas);
		const results: GridArea[] = [];

		function overlapsPreviousResult(area: GridArea): boolean {
			return results.some(previousResult => area !== previousResult && isOverlaping(area, previousResult))
		}

		const cells = makeGrid(
			nbCols,
			nbRows, 
			(x, y) => {			
				let result = getAreaByCell(results, x, y) ?? getAreaByCell(noOverlap, x, y);

				({noOverlap = [], overlaping = []} = Object.groupBy(
					allAreas, 
					area => (area !== result && overlapsPreviousResult(area)) ? 'overlaping' : 'noOverlap'
				));
				

				if (result === null || overlapsPreviousResult(result)) {
					return null;
				}
				if (!results.includes(result)) {
					results.push(result);
				}

				// return the area we found at the start
				return result;
			}
		);

		return [
			cells, 
			overlaping
		];
	})

	const templateAreas = computed<(GridArea|null)[][]>(() => grid2d.value[0]);
	const overlapingAreas = computed<GridArea[]>(() => grid2d.value[1])

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

	return {
		areas,
		areaByCells,
		updateItem,
		overlapingAreas,
		templateAreas,

		columns,
		userColumnLineNames,
		columnTracks,
		numberOfColumns,

		rows,
		numberOfRows,
		grid2d
	}

});