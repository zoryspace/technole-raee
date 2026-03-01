import { z } from "zod";

export const idParamSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

export const emptyQuerySchema = z.object({}).strict();

export { z };
