import { beforeEach, expect, it, describe, vi, Mock } from "vitest";
import { makeGrid, makeNullGrid } from "../../src/helper/array.helper";

describe('makeNullGrid', () => {
	const rows = 5;
	const cols = 3;
	let grid;
	beforeEach(() => {
		grid = makeNullGrid(cols, rows);
	})

	it('should be filled with null', () => {
		expect(grid).toSatisfy(value => Array.isArray(value) && value.every(row => Array.isArray(row) && row.every(cell => cell === null)))
	});
	it('should have the right number of columns', () => {
		expect(grid).toSatisfy(value => Array.isArray(value) && value.every(row => row.length === cols));
	});
	it('should have the right number of rows', () => {
		expect(grid).toHaveLength(rows);
	});
});

describe('makeGrid', () => {
	const rows = 5;
	const cols = 3;
	let grid: string[][], spy: Mock<(col: number, row: number) => string>;
	const implementation = (col:number, row: number) => `${col}:${row}`;

	beforeEach(() => {
	spy = vi.fn(implementation);
	grid = makeGrid(cols, rows, spy);
	})

	it('should be filled with formated strings', () => {
		expect(grid).toSatisfy(value => 
			Array.isArray(value) 
			&& value.every((row, y) => Array.isArray(row) 
			&& row.every((cell, x) => cell === implementation(x, y))))
	});
	it('should have the right number of columns', () => {
		expect(grid).toSatisfy(value => Array.isArray(value) && value.every(row => row.length === cols));
	});
	it('should have the right number of rows', () => {
		expect(grid).toHaveLength(rows);
	});
	it('should invoke the initiator for every cell', () => {
		expect(spy).toBeCalledTimes(cols * rows);

		grid.forEach((row, y) => {
			row.forEach((_, x) => {
				expect(spy).toHaveBeenCalledWith(x, y);
			});
		});
	});
});
