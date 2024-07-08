export function isDefined<T = any>(value: T | undefined): value is T {
	return typeof value !== 'undefined';
}

export function isString(value: any | undefined): value is string {
	return typeof value === 'string';
}