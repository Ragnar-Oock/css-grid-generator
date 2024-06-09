import { ExplicitRowTrack, ExplicitRowTrackObj, ExplicitTrackList } from "../components/grid";

export function serializeExplicitTrackList(explicitTrackList: ExplicitTrackList): string {
	return explicitTrackList.map(({lineNames, trackSize}) => `${lineNames ?? ''} ${trackSize === '' ? 'auto' : trackSize}`).join(' ');
}



export function serializeTrack({lineNamesStart, areas, trackSize, lineNamesEnd}: ExplicitRowTrackObj): ExplicitRowTrack {
	return `${lineNamesStart} '${areas.join(' ')}' ${trackSize} ${lineNamesEnd}`;
}