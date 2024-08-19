import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getAllAreasByCell, getAreaByCell, getAreaIndex } from "../helper/area.helper";
import { makeGrid } from "../helper/array.helper";
import { getRandomColor } from "../helper/color.helper";
import { isString } from "../helper/type.helper";
import { ExplicitRowTrackState, ExplicitTrack, ExplicitTrackList, GridArea, LineNames, TrackSize } from "../types/grid.type";
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
		{trackSize: '50px'},
		{trackSize: '20vw', lineNames: '[boris-start]'},
		{trackSize: 'auto', lineNames: '[boris-end]'},
		{}
	]);

	/**
	 * holds the "width" of the column tracks, there's always at least one item in this array
	 */
	const columnTracks = ref<OneOrMore<TrackSize>>([
		'20%',
		'1fr',
		'50px',
		'20vw',
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

	const grid2d = computed<[cells: (GridArea|null)[][], overlaping: GridArea[]]>(() => {
		const nbCols = numberOfColumns.value;
		const nbRows = numberOfColumns.value;
		let allAreas: GridArea[] = areas.value.sort((a, b) => getAreaIndex(a, nbCols) - getAreaIndex(b, nbCols));
		let noOverlap = Array.from(allAreas);
		const overlapingAreas: GridArea[] = [];

		const cells = makeGrid(
			nbCols,
			nbRows, 
			(x, y) => {
				// find the first area that doesn't overlap any other and that fit the cell
				const result = getAreaByCell(noOverlap, x, y);
				// find all the areas that fit the cell
				const overlaping = getAllAreasByCell(allAreas, x, y)
				// remove the result from the overlaping areas
					.filter(area => area !== result);

				// remove the others from the list of areas that don't overlap (because if they are in that same area they do overlap)
				noOverlap = noOverlap.filter(area => !overlaping.includes(area));
				// add the overlaping areas to the list of overlaping areas
				overlapingAreas.push(...overlaping);
				
				// return the area we found at the start
				return result;
			}
		);

		return [
			cells, 
			Array.from(new Set(overlapingAreas))
		];
	})


	const templateAreas = computed<(GridArea|null)[][]>(() => grid2d.value[0]);
	const overlapingAreas = computed<GridArea[]>(() => grid2d.value[1])

	/**
	 * finds all the areas that are starting or ending at the given line and add their 
	 * name to the line names if the area is overlaping another one and can't be put 
	 * in the area string
	 * 
	 * @param columnLineIndex index of the column line (not track)
	 * @todo
	 */
	function columnLineNamesFromAreas(columnLineIndex: number): Tracknames {
		const areaArray = Array.from(overlapingAreas.value);
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

	const computedColumns = computed<ExplicitTrackList>(() => ([
			...userColumnLineNames
				.value
				.map((userLineNames, index) => ({
					lineNames: formatLineNames([...userLineNames, ...columnLineNamesFromAreas(index)]),
					trackSize: columnTracks.value[index] ?? 'auto'
				})) as OneOrMore<ExplicitTrack>,
			{}
		]));

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
		areaByCells,
		updateItem,
		overlapingAreas,
		templateAreas,

		columns,
		userColumnLineNames,
		columnTracks,
		computedColumns,
		numberOfColumns,

		rows,
		numberOfRows,
		grid2d
	}

});