export function generateCode(length: number = 5): string {
		return Array.from({ length }, function () {
				return Math.floor(Math.random() * 10)
		}).join('');
}
