import type { Blog } from "../services/parsers/blogs.parser.js";

export function pearson(blogA: Blog, blogB: Blog): number {
	let sumA: number = 0;
	let sumB: number = 0;

	let sumASquared: number = 0;
	let sumBSquared: number = 0;

	let productSum: number = 0;

	const matching = 706; // TODO: Update to none hard-coded value

	for (let i = 0; i <= matching; i++) {
		const countA = blogA.wordCounts[i];
		const countB = blogB.wordCounts[i];

		sumA += countA;
		sumB += countB;

		sumASquared += countA ** 2;
		sumBSquared += countB ** 2;

		productSum += countA * countB;
	}

	const num = productSum - (sumA * sumB) / matching;
	const den = Math.sqrt(
		(sumASquared - sumA ** 2 / matching) * (sumBSquared - sumB ** 2 / matching),
	);

	return 1 - num / den;
}
