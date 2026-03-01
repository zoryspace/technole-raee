import { z, idParamSchema, emptyQuerySchema } from "./common.js";

const optionalTrimmed = (max) =>
  z.string().trim().max(max).optional().nullable().transform((v) => (v == null ? null : v));

export const clientsQuerySchema = emptyQuerySchema;

export const createClientBodySchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    contact: optionalTrimmed(150),
    email: z.string().trim().email().max(150).optional().nullable().transform((v) => (v == null ? null : v)),
    phone: optionalTrimmed(30),
    nif: optionalTrimmed(20),
  })
  .strict();

export const updateClientBodySchema = createClientBodySchema;

export const clientIdParamSchema = idParamSchema;
