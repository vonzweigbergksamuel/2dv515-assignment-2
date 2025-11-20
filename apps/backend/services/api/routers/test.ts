import * as z from "zod";
import { publicProcedure } from "../index.js";

export const testRouter = {
	test: publicProcedure
		.route({ method: "GET" })
		.input(z.object({ limit: z.number().optional() }))
		.output(z.object({ message: z.string(), timestamp: z.number() }))
		.handler(() => {
			return { message: "OK", timestamp: Date.now() };
		}),
};
