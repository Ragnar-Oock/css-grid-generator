export type Interaction<payload = never> = {
	start: (event: MouseEvent, payload: payload) => void;
	perform?: (event: MouseEvent) => void;
	finish: (event: MouseEvent) => void;
}
