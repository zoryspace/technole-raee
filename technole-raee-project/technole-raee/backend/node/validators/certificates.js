import { z, emptyQuerySchema } from "./common.js";

export const certificatesQuerySchema = emptyQuerySchema;

export const createCertificateBodySchema = z
  .object({
    collectionId: z.coerce.number().int().positive(),
  })
  .strict();
