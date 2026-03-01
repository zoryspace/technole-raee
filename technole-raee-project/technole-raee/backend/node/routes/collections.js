/**
 * routes/collections.js
 */
import { Router } from "express";
import { pool } from "../db/pool.js";
import { auth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  collectionsQuerySchema,
  createCollectionBodySchema,
  updateCollectionBodySchema,
  collectionIdParamSchema,
  updateDevicesBodySchema,
} from "../validators/collections.js";

export const collectionsRouter = Router();

// GET /api/collections  (incluye dispositivos)
collectionsRouter.get(
  "/",
  auth,
  validate({ query: collectionsQuerySchema }),
  async (_req, res, next) => {
    try {
      const { rows: cols } = await pool.query("SELECT * FROM collections ORDER BY date DESC");
      const { rows: devs } = await pool.query("SELECT * FROM devices ORDER BY id");
      const result = cols.map((c) => ({
        ...c,
        devices: devs.filter((d) => d.collection_id === c.id),
      }));
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

// POST /api/collections
collectionsRouter.post(
  "/",
  auth,
  validate({ body: createCollectionBodySchema, query: collectionsQuerySchema }),
  async (req, res, next) => {
    const { clientId, date, address, technician, serviceType } = req.body;
    try {
      const { rows } = await pool.query(
        `INSERT INTO collections (client_id, date, address, technician, service_type)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [clientId, date, address, technician, serviceType]
      );
      res.status(201).json({ ...rows[0], devices: [] });
    } catch (e) {
      next(e);
    }
  }
);

// PUT /api/collections/:id
collectionsRouter.put(
  "/:id",
  auth,
  validate({ params: collectionIdParamSchema, body: updateCollectionBodySchema, query: collectionsQuerySchema }),
  async (req, res, next) => {
    const { clientId, date, address, technician, serviceType } = req.body;
    try {
      const { rows } = await pool.query(
        `UPDATE collections SET client_id=$1, date=$2, address=$3, technician=$4, service_type=$5
       WHERE id=$6 RETURNING *`,
        [clientId, date, address, technician, serviceType, req.params.id]
      );
      if (!rows.length) return res.status(404).json({ error: "Not found" });
      return res.json(rows[0]);
    } catch (e) {
      return next(e);
    }
  }
);

// PUT /api/collections/:id/devices
collectionsRouter.put(
  "/:id/devices",
  auth,
  validate({ params: collectionIdParamSchema, body: updateDevicesBodySchema, query: collectionsQuerySchema }),
  async (req, res, next) => {
    const { devices } = req.body;
    const colId = Number(req.params.id);
    try {
      await pool.query("DELETE FROM devices WHERE collection_id=$1", [colId]);
      for (const d of devices) {
        await pool.query(
          "INSERT INTO devices (collection_id, brand, model, serial, method) VALUES ($1,$2,$3,$4,$5)",
          [colId, d.brand, d.model, d.serial, d.method]
        );
      }
      const { rows } = await pool.query("SELECT * FROM devices WHERE collection_id=$1", [colId]);
      res.json({ id: colId, devices: rows });
    } catch (e) {
      next(e);
    }
  }
);

// DELETE /api/collections/:id
collectionsRouter.delete(
  "/:id",
  auth,
  validate({ params: collectionIdParamSchema, query: collectionsQuerySchema }),
  async (req, res, next) => {
    try {
      await pool.query("DELETE FROM collections WHERE id=$1", [req.params.id]);
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  }
);
