export type Color = `hsl(${number}, ${number}%, ${number}%)`

export function getRandomColor(): Color {
	return `hsl(${Math.round(Math.random() * 360)}, 80%, 80%)`
}