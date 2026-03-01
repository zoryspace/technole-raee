import { z, idParamSchema, emptyQuerySchema } from "./common.js";

const deviceSchema = z
  .object({
    id: z.number().int().positive().optional(),
    brand: z.string().trim().min(1).max(100),
    model: z.string().trim().min(1).max(150),
    serial: z.string().trim().max(100).optional().nullable().transform((v) => (v == null ? null : v)),
    method: z.enum(["borrado_logico", "trituracion", "otros"]),
  })
  .strict();

export const collectionsQuerySchema = emptyQuerySchema;

export const createCollectionBodySchema = z
  .object({
    clientId: z.coerce.number().int().positive(),
    date: z.string().date(),
    address: z.string().trim().max(500).optional().nullable().transform((v) => (v == null ? null : v)),
    technician: z.string().trim().max(150).optional().nullable().transform((v) => (v == null ? null : v)),
    serviceType: z.string().trim().min(1).max(100).optional().nullable().transform((v) => (v == null ? null : v)),
  })
  .strict();

export const updateCollectionBodySchema = createCollectionBodySchema;

export const collectionIdParamSchema = idParamSchema;

export const updateDevicesBodySchema = z
  .object({
    devices: z.array(deviceSchema),
  })
  .strict();
