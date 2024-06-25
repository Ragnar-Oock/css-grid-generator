import { clamp } from "./math.helper";

const regexp = /^((-?\d(\.\d)?)+)(\D+)$/;
function parse(string: string): {value: number, suffix: string, float: string} | null {
	try {
		const results = regexp.exec(string);

		if (results === null) {
			return null;
		}

		return {
			value: parseFloat(results[1]), 
			suffix: results[4],
			float: results[1],
		};
	} catch (error) {
		if(import.meta.env.DEV) {
			console.log(`failed to parse string "${string}"`, error);
			
		}

		return null;
		
	}
}

type SuffixedString<value extends number = number, suffix extends string = string> = `${value}${suffix}`;

export function incrementString<value extends number = number, suffix extends string = string>(string: SuffixedString<value, suffix>, increment?: number, min?: number, max?: number): SuffixedString<number, suffix>;
export function incrementString<input extends string>(string: input, increment?: number, min?: number, max?: number): input;
export function incrementString(string: string, increment = 1, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY): string {
	const parsed = parse(string);

	if (parsed === null) {
		return string;
	}

	const sourceMantisaLength = parsed.float.split('.')[1]?.length;
	const incrementMantisaLength = increment.toString(10).split('.')[1]?.length;
	const mantisaLength = sourceMantisaLength ?? incrementMantisaLength ?? 0;

	const newValue = clamp(min, parsed.value + increment, max);
	const formatedValue = (newValue).toFixed(mantisaLength).replace(/^(\d+\.[1-9]*|)0+$/, '$1').replace(/\.$/, '')
	
	return `${formatedValue === '' ? 0 : formatedValue}${parsed.suffix}`
}

export function decrementString<value extends number = number, suffix extends string = string>(string: SuffixedString<value, suffix>, increment?: number): SuffixedString<number, suffix>;
export function decrementString(string: string, increment?: number): string;
export function decrementString(string: string, decrement = 1): string {
	return incrementString(string, decrement * -1);
}