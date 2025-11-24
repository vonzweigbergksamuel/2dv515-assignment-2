import type { Blog } from "../services/parsers/blogs.parser.js";
import { pearson, type WordCounts } from "./pierson.js";

interface Centroid {
	wordCounts: WordCounts;
	assignments: Blog[];
}

export function kMeans(blogs: Blog[], k: number, maxIterations: number = 20) {
	if (blogs.length === 0 || k <= 0) {
		return [];
	}

	const allWords = new Set<string>();
	for (const blog of blogs) {
		Object.keys(blog.wordCounts).map((word: string) => allWords.add(word));
	}
	const words = Array.from(allWords);
	const n = words.length;

	const minMax = calculateMinMax(blogs, words);
	const centroids = initializeCentroids(k, words, minMax);

	for (let i = 0; i < maxIterations; i++) {
		for (const centroid of centroids) {
			centroid.assignments = [];
		}

		for (const blog of blogs) {
			let distance = Infinity;
			let best: Centroid | null = null;

			for (const centroid of centroids) {
				const cDist = pearson(centroid.wordCounts, blog.wordCounts);

				if (cDist < distance) {
					best = centroid;
					distance = cDist;
				}
			}

			if (best) {
				best.assignments.push(blog);
			}
		}

		for (const centroid of centroids) {
			for (let i = 0; i < n; i++) {
				const word = words[i];
				let avg = 0;

				for (const blog of centroid.assignments) {
					avg += blog.wordCounts[word] || 0;
				}

				if (centroid.assignments.length > 0) {
					avg /= centroid.assignments.length;
				}

				centroid.wordCounts[word] = avg;
			}
		}
	}

	return centroids;
}

function calculateMinMax(
	blogs: Blog[],
	words: string[],
): {
	min: Record<string, number>;
	max: Record<string, number>;
} {
	const min: Record<string, number> = {};
	const max: Record<string, number> = {};

	for (const word of words) {
		min[word] = Infinity;
		max[word] = -Infinity;

		for (const blog of blogs) {
			const count = blog.wordCounts[word] || 0;
			min[word] = Math.min(min[word], count);
			max[word] = Math.max(max[word], count);
		}
	}

	return { min, max };
}

function initializeCentroids(
	k: number,
	words: string[],
	minMax: { min: Record<string, number>; max: Record<string, number> },
): Centroid[] {
	const centroids: Centroid[] = [];

	for (let c = 0; c < k; c++) {
		const wordCounts: Record<string, number> = {};

		for (let i = 0; i < words.length; i++) {
			const word = words[i];
			const min = minMax.min[word];
			const max = minMax.max[word];
			wordCounts[word] = Math.random() * (max - min) + min;
		}

		centroids.push({
			wordCounts,
			assignments: [],
		});
	}
	return centroids;
}
