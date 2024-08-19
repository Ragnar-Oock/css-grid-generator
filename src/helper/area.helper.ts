import { Coord } from "../stores/mouse-position.store";
import { GridArea } from "../types/grid.type";
import { getRandomColor } from "./color.helper";

/**
 * List all the areas present on a given line
 * @param lineNumber the line to compute starting from 1.
 * @returns a list of area name for each cell on the line.
 */
export function getAreasOnLine(areas: GridArea[], lineNumber: number, lineLength: number): string[] {
	return Array
		.from({length: lineLength}, (_, columnNumber) => {
			return getAreaByCell(areas, columnNumber, lineNumber)?.area ?? '.';
		});
}

/**
 * check if an area is in a cell or not
 * @param area area to check
 * @param columnLineIndex column index of the cell of interest (0 indexed)
 * @param rowLineIndex row index of the cell of interest (0 indexed)
 */
function cellMatcher(area: GridArea, columnLineIndex: number, rowLineIndex: number): boolean {
	return (
		area.columnStart <= columnLineIndex + 1 && columnLineIndex + 1 < area.columnEnd 
		&& area.rowStart <= rowLineIndex + 1  && rowLineIndex + 1 < area.rowEnd
	)
}

/**
 * find the first area that fits a given cell
 * @param areas list of the areas to search throught
 * @param columnLineIndex column index of the cell (0 indexed)
 * @param rowLineIndex row index of the cell (0 indexed)
 */
export function getAreaByCell(areas: GridArea[], columnLineIndex: number, rowLineIndex: number): GridArea | null {
	return areas.find(area => cellMatcher(area, columnLineIndex, rowLineIndex)) ?? null
}

export function getAllAreasByCell(areas: GridArea[], columnLineIndex: number, rowLineIndex: number): GridArea[] {
	return areas.filter(area => cellMatcher(area, columnLineIndex, rowLineIndex));
}

let newAreaCount = 0;
export function makeArea({x, y}: Coord): GridArea {
	return {
		area: `new-area-${newAreaCount ++}`,
		color: getRandomColor(),
		columnStart: x,
		columnEnd: x + 1,
		rowStart: y,
		rowEnd: y + 1,
	}
}
export function getAreaIndex(area: GridArea, nbCols: number): number {
	return area.columnStart + (area.rowStart - 1) * nbCols;
}