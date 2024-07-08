import { LenghtUnit, Length, LengthPercentage } from "../types/css.type";
import { FitContent, InflexibleBreadth, TrackSize } from "../types/grid.type";
import { ParsedSuffixedString, parseSuffixedString } from "./incrementable-string.helper";
import { isString } from "./type.helper";


const namedTokens = ['min-content', 'max-content', 'auto'];

function isNamedToken(candidate: string): boolean {
	return namedTokens.includes(candidate);
}

function isValidLength(candidate: string): candidate is Length {
	const parsed = parseSuffixedString(candidate);
	if (parsed !== null) {
		return isValidParsedLength(parsed);
	}
	return false;
}

function isValidPercentage(candidate: string): candidate is LengthPercentage {
	return parseSuffixedString(candidate)?.suffix === '%';
}

function isValidParsedLength(candidate: ParsedSuffixedString): boolean {
	return (LenghtUnit as ReadonlyArray<string>).includes(candidate.suffix);
}

const fitContentRegExp = /^fit-content\((.+)\)$/;
function isFitContent(candidate: string): candidate is FitContent {
	const match = fitContentRegExp.exec(candidate)	;
	if (match === null) {
		return false;
	}

	// if we can't extract a suffixes number the value is invalid
	const parsed = parseSuffixedString(match[0]);
	if (parsed === null) {
		return false;
	}

	return isValidParsedLength(parsed);	
}

export function isValidInflexibleBreadth(candidate: string): candidate is InflexibleBreadth {
	return isNamedToken(candidate) || isValidPercentage(candidate);
}

const minMaxRegExp = /^minmax\((.+),(.+)\)$/;
export function isValidMinMax(candidate: string): candidate is MinMax {
	const match = minMaxRegExp.exec(candidate);
	if (match === null) {
		return false;
	}

	const [,inflexibleBreadth, trackBreadth] = match

	if (!isString(inflexibleBreadth) || !isString(trackBreadth)) {
		return false;
	}

	if (!isValidPercentage(inflexibleBreadth) && !isNamedToken(inflexibleBreadth)) {
		return false;
	}

	if () {
		return false;
	}

}

export function isValidTrackSize(candidate: string): candidate is TrackSize {
	return isNamedToken(candidate) || isValidLength(candidate) || isFitContent(candidate);
}
