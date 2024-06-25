export function clamp(min: number, target: number, max: number): number {
	return target < min ? min : max < target ? max : target;
}