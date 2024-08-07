import { InjectionKey, Ref } from "vue";
import { Color } from "../helper/color.helper";
import * as CSS from './css.type';
import { OneOrMore, Prettify } from "./helper.type";

export type Item = {
	area: string;
	color: string;
}

export type Area = {
	name: string;
}

export type Template = string;

export type GridIndent = {
	name: string | null;
}
export type GridColumn = {
	width: CSS.Length;
}

/**
 * Formal Syntax
 * ```
 * <flex [0,∞]>
 * ```
 * @see {@link https://drafts.csswg.org/css-grid-2/#valdef-grid-template-columns-flex-0 W3C css-grid-2}
 */
export type FlexFactor = `${number}fr`;


export type InflexibleBreadth = 'auto' | 'min-content' | 'max-content' | CSS.LengthPercentage;
export type FitContent = `fit-content(${CSS.Length})` | `fit-content(${CSS.LengthPercentage})`;
export type TrackBreadth = CSS.LengthPercentage | FlexFactor | 'min-content' | 'max-content' | 'auto';
export type MinMax = `minmax(${InflexibleBreadth}, ${TrackBreadth})`;
export type TrackSize = TrackBreadth | MinMax | FitContent;
export type LineNames = `[${string}]`;

export type GridTemplateRows = '';
export type GridTemplateColumns = '';

/**
 * Formal Syntax
 * ```
 * [ <'grid-template-rows'> / <'grid-template-columns'> ] 
 * ```
 */
export type SimpleGridTemplate = `${GridTemplateRows} / ${GridTemplateColumns}` ;
export type ExplicitTrack = {
	lineNames?: LineNames;
	trackSize: TrackSize | '';
};

export type LastExplicitTrack = {
	lineNames?: LineNames;
	trackSize?: undefined;
}
/**
 * Formal Syntax
 * ```
 * <explicit-track-list> = [ <line-names>? <track-size> ]+ <line-names>?  
 * ```
 */
export type ExplicitTrackList = [ ...OneOrMore<ExplicitTrack>, LastExplicitTrack ];

export type ExplicitRowTrackState = {
	lineNamesStart: LineNames | '';
	trackSize: TrackSize | '';
	lineNamesEnd: LineNames | '';
}

export type ExplicitRowTrackObj = Prettify<{ areas: string[] } & ExplicitRowTrackState>;
export type ExplicitRowTrack = `${LineNames|''} ${string} ${TrackSize|''} ${LineNames|''}`;

/**
 * Formal Syntax
 * ```
 * [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]?
 * ```
 */
export type ComplexGridTemplate = {
	lines: ExplicitRowTrack[];
	columns: ExplicitTrackList
};

export type GridTemplate = 
	| 'none'
	| SimpleGridTemplate
	| ComplexGridTemplate;

/*

                 '.    img                img  img  title title            title title' auto [award-start]
   [award-start] '.    img                img  img  .     .                .     round' 40px 
                 'icon icon               icon .    .     .                .     round' auto [award-end]
               / 100px 1fr  [award-start] 20px 1fr   1fr   1fr [award-end] 5%    150px  ;
*/


export const containerSymbol = Symbol('container') as InjectionKey<Ref<HTMLElement>>

export type GridArea = {
	area: string;
	color: Color,
	rowStart: number;
	rowEnd: number;
	columnStart: number;
	columnEnd: number;
}
export type Track = {
	domRect: DOMRect;
	index: number;
};