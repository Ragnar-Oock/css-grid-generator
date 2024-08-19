// this could be a lot simpler... but I wanted to play with iterators/generators
function* iterate<T>(to: number, initializer: (i: number) => T): Generator<T, void, unknown> {
	for (let i = 0; i < to ; i++) {
		yield initializer(i)
	}
}


/**
 * Generate a row major matrix of "stuff" initialized by the provided initializer function
 * @param cols number of columns in the grid
 * @param rows number of rows in the grid
 * @param initializer an initializer function that runs on every cell and given the position of said cell
 */
export function makeGrid<T extends unknown = null>(cols: number, rows: number, initializer?: (col: number, row: number) => T): T[][] {
	return Array.from(iterate(rows, row => 
		Array.from(iterate(cols, col => 
			initializer?.(col, row) ?? null as T
		))
	));
}



/**
 * Generate a row major matrix filled with `null`
 * @param cols number of columns in the grid
 * @param rows number of rows in the grid
 */
export function makeNullGrid(cols: number, rows: number): null[][] {
	return Array.from(iterate(rows, () => 
		Array.from(iterate(cols, () => 
			null
		))
	));
}
