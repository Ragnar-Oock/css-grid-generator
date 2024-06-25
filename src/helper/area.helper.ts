import { GridArea } from "../components/grid";

/**
 * List all the areas present on a given line
 * @param lineNumber the line to compute starting from 1.
 * @returns a list of area name for each cell on the line.
 */
export function getAreasOnLine(areas: GridArea[], lineNumber: number, lineLength: number): string[] {
	return Array
		.from({length: lineLength}, (_, columnNumber) => {
			return areas.find((area,) =>
				area.columnStart <= columnNumber + 1 && columnNumber + 1 < area.columnEnd 
				&& area.rowStart <= lineNumber && lineNumber < area.rowEnd
			)?.area ?? '.';
		});
}

