export function getRandomColor(): string {
	return `hsl(${Math.round(Math.random() * 360)}, 80%, 80%)`
}