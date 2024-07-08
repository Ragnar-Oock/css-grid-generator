// #region Units
/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/length#absolute_length_units Absolute length units}
 */
export const AbsoluteLengthUnit = ['cm', 'mm', 'Q', 'in', 'pc', 'pt', 'px'] as const

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/length#relative_length_units_based_on_font Relative length units based on font}
 */
export const FontRelativeLengthUnit = ['cap', 'ch', 'em', 'ex', 'ic', 'lh'] as const;

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/length#relative_length_units_based_on_root_elements_font Relative length units based on root element's font}
 */
export const RootFontRelativeLengthUnit = ['rcap', 'rch', 'rem', 'rex', 'ric', 'rlh'] as const;

export const ViewportUnitSufixes = ['vh', 'vw', 'vmax', 'vmin', 'vb', 'vi'] as const;
export const ViewportSizePrefixes = ['s', 'l', 'd', ''] as const;
export const ViewportRelativeLengthUnit = ViewportSizePrefixes
	.flatMap(prefix => ViewportUnitSufixes.map(sufix => `${prefix}${sufix}` as const));

/**
 * All allowed CSS units (except `fr` and `%` because they are special)
 */
export const LenghtUnit = [
	...AbsoluteLengthUnit,
	...FontRelativeLengthUnit,
	...RootFontRelativeLengthUnit,
	...ViewportRelativeLengthUnit
] as const;

// #endregion

export type Length = `${number}${typeof LenghtUnit[number]}`;

export type LengthPercentage = `${number}%`;
