import type { ContentLength, CustomProp, Length, LengthPercentage } from '../types/css.type';
import { ContentLengthValues, Flexible, LenghtUnit, Percentage } from '../types/css.type';
import { TrackBreadth } from '../types/grid.type';

import { parseSuffixedString } from "./incrementable-string.helper";

export function isLength(str: string): str is Length {
	const parsed = parseSuffixedString(str);
	return parsed !== null && (LenghtUnit as ReadonlyArray<string>).includes(parsed.suffix);
}


export function isLengthPercentage(str: string): str is LengthPercentage {
	const parsed = parseSuffixedString(str);
	return parsed !== null && parsed.suffix === '%';
}

export function isContentLength(str: string): str is ContentLength {
	return (ContentLengthValues as ReadonlyArray<string>).includes(str);
}

const customPropRegExp = /var\(--[A-Za-z0-9\-_\u00A0-\uffff]*?(, *?.*)?\)/g
export function isCustomProperty(str: string): str is CustomProp {
	return customPropRegExp.exec(str) !== null;
}

export function isTrackBreadth(str: string): str is TrackBreadth {
	const parsed = parseSuffixedString(str);

	return (
		parsed !== null
		&& ([
			...LenghtUnit,
			Percentage,
			Flexible,
		]).includes(parsed.suffix)
	) || (
		isContentLength(str)
	) || (
		isCustomProperty(str)
	)
}