import { Directive } from "vue";

export const vAutoFocus = {
	mounted(elemnt) {
		elemnt.focus();
	}
} satisfies Directive<HTMLElement>