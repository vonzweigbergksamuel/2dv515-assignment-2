import * as z from "zod";
import { kMeans } from "../../../utils/k-means.js";
import { getParsedBlogs } from "../../parsers/blogs.parser.js";
import { publicProcedure } from "../index.js";

export const testRouter = {
	test: publicProcedure
		.route({ method: "GET" })
		.input(z.object({ limit: z.number().optional() }))
		.output(z.object({ message: z.string(), timestamp: z.number() }))
		.handler(async () => {
			const blogs = await getParsedBlogs();

			if (!blogs) {
				throw new Error("Blogs are undefined");
			}

			const clusters = kMeans(blogs, 5, 100);
			const assignments = clusters.map((cluster) =>
				cluster.assignments.map((blog) => blog.name),
			);

			console.log("Assignments", assignments);

			return { message: "OK", timestamp: Date.now() };
		}),
};
