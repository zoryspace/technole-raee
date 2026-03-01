import { z, emptyQuerySchema } from "./common.js";

export const authQuerySchema = emptyQuerySchema;

export const loginBodySchema = z
  .object({
    email: z.string().trim().email().max(150),
    password: z.string().min(1).max(200),
  })
  .strict();
