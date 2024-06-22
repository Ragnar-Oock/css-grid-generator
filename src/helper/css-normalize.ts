import { ExplicitRowTrack, ExplicitRowTrackObj, ExplicitTrackList } from "../components/grid";

export function serializeExplicitTrackList(explicitTrackList: ExplicitTrackList): string {
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