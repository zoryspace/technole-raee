/**
 * routes/certificates.js
 */
import { Router } from "express";
import { pool } from "../db/pool.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  certificatesQuerySchema,
  createCertificateBodySchema,
} from "../validators/certificates.js";

export const certificatesRouter = Router();

const newCertId = async () => {
  const year = new Date().getFullYear();
  const { rows } = await pool.query("SELECT COUNT(*) FROM certificates WHERE date_part('year', issued) = $1", [year]);
  const n = Number(rows[0].count) + 1;
  return `RAEE-${year}-${String(n).padStart(3, "0")}`;
};

// GET /api/certificates
certificatesRouter.get(
  "/",
  auth,
  validate({ query: certificatesQuerySchema }),
  async (_req, res, next) => {
    try {
      const { rows } = await pool.query("SELECT * FROM certificates ORDER BY issued DESC");
      res.json(rows);
    } catch (e) {
      next(e);
    }
  }
);

// POST /api/certificates  (genera y marca la recogida)
certificatesRouter.post(
  "/",
  auth,
  validate({ body: createCertificateBodySchema, query: certificatesQuerySchema }),
  async (req, res, next) => {
    const { collectionId } = req.body;
    try {
      const certId = await newCertId();
      const { rows } = await pool.query(
        "INSERT INTO certificates (id, collection_id, issued) VALUES ($1,$2,CURRENT_DATE) RETURNING *",
        [certId, collectionId]
      );
      await pool.query("UPDATE collections SET certified=true, cert_id=$1 WHERE id=$2", [certId, collectionId]);
      res.status(201).json(rows[0]);
    } catch (e) {
      next(e);
    }
  }
);
