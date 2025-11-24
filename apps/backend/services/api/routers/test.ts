import * as z from "zod";
import { publicProcedure } from "../index.js";
import { getParsedBlogs } from "../../parsers/blogs.parser.js";

export const testRouter = {
	test: publicProcedure
		.route({ method: "GET" })
		.input(z.object({ limit: z.number().optional() }))
		.output(z.object({ message: z.string(), timestamp: z.number() }))
		.handler(async () => {
			const blog = await getParsedBlogs();
			console.log("blogs", blog![0]);
			return { message: "OK", timestamp: Date.now() };
		}),
};
