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

export const clusterRouter = {
	clusters: publicProcedure
		.route({ method: "GET" })
		.output(outputSchema)
		.handler(async () => {
			const blogs = await getParsedBlogs();

			if (!blogs) {
				throw new Error("Blogs are undefined");
			}

			const clusters = kMeans(blogs, 5, 100);

			return clusters.map((cluster, index) => {
				return {
					id: index,
					assignments: cluster.assignments.map((blog) => blog.name),
				};
			});
		}),
};
