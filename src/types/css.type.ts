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

export const Flexible = 'fr';
export const Percentage = '%';

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

export type LengthPercentage = `${number}${typeof Percentage}`;

/**
 * Formal Syntax
 * ```
 * <flex [0,∞]>
 * ```
 * @see {@link https://drafts.csswg.org/css-grid-2/#valdef-grid-template-columns-flex-0 W3C css-grid-2}
 */
export type FlexFactor = `${number}${typeof Flexible}`;

export type CustomProp = `var(--${string})` | `var(--${string},${string})`;


export const ContentLengthValues = ['min-content', 'max-content', 'auto'] as const;
export type ContentLength = typeof ContentLengthValues[number];