import * as z from "zod";
import { kMeans } from "../../../utils/k-means.js";
import { getParsedBlogs } from "../../parsers/blogs.parser.js";
import { publicProcedure } from "../index.js";

const outputSchema = z.array(
	z.object({
		id: z.number(),
		assignments: z.array(z.string()),
	}),
);

let cachedClusters: ReturnType<typeof kMeans> | null = null;
let cachedK: number | null = null;
let cachedMaxIterations: number | null = null;

export const clusterRouter = {
	clusters: publicProcedure
		.route({ method: "GET" })
		.input(
			z.object({
				k: z.coerce.number().optional().default(5),
				maxIterations: z.coerce.number().optional().default(20),
				force: z.coerce.boolean().optional().default(false),
			}),
		)
		.output(outputSchema)
		.handler(async ({ input }) => {
			const blogs = await getParsedBlogs();

			if (!blogs) {
				throw new Error("Blogs are undefined");
			}

			// Check if the clusters are cached and the input is the same
			if (
				!input.force &&
				cachedClusters &&
				cachedK === input.k &&
				cachedMaxIterations === input.maxIterations
			) {
				console.log("Returned cached clusters");
				return cachedClusters.map((cluster, index) => ({
					id: index,
					assignments: cluster.assignments.map((blog) => blog.name),
				}));
			}

			const clusters = kMeans(blogs, input.k, input.maxIterations);
			cachedClusters = clusters;
			cachedK = input.k;
			cachedMaxIterations = input.maxIterations;

			return clusters.map((cluster, index) => {
				return {
					id: index,
					assignments: cluster.assignments.map((blog) => blog.name),
				};
			});
		}),
};
