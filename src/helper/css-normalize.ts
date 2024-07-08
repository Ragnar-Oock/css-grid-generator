import { ExplicitRowTrack, ExplicitRowTrackObj, ExplicitTrack, TrackSize } from "../types/grid.type";
import { OneOrMore } from "../types/helper.type";

export function serializeExplicitTrackList(explicitTrackList: OneOrMore<ExplicitTrack>): string {
	return explicitTrackList
		.map(({ lineNames, trackSize }, index, { length }) => {
			if (index === length - 1) {
				return lineNames ?? '';
			}
			return `${lineNames ?? ''} ${trackSize === '' ? 'auto' : trackSize}`;
		})
		.join(' ');
}



export function serializeTrack({ lineNamesStart, areas, trackSize, lineNamesEnd }: ExplicitRowTrackObj): ExplicitRowTrack {
	return `${lineNamesStart} '${areas.join(' ')}' ${trackSize} ${lineNamesEnd}`;
}