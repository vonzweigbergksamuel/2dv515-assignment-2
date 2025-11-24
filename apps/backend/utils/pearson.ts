export type WordCounts = Record<string, number>;

export function pearson(
	wordCountsA: WordCounts,
	wordCountsB: WordCounts,
): number {
	let sumA: number = 0;
	let sumB: number = 0;
	let sumASquared: number = 0;
	let sumBSquared: number = 0;
	let productSum: number = 0;

	const allWords = new Set([
		...Object.keys(wordCountsA),
		...Object.keys(wordCountsB),
	]);
	const numWords = allWords.size;

	for (const word of allWords) {
		const countA = wordCountsA[word] || 0;
		const countB = wordCountsB[word] || 0;

		sumA += countA;
		sumB += countB;
		sumASquared += countA ** 2;
		sumBSquared += countB ** 2;
		productSum += countA * countB;
	}

	const num = productSum - (sumA * sumB) / numWords;
	const den = Math.sqrt(
		(sumASquared - sumA ** 2 / numWords) * (sumBSquared - sumB ** 2 / numWords),
	);

	return 1 - num / den;
}
