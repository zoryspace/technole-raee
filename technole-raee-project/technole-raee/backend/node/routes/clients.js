/**
 * routes/clients.js
 * CRUD completo de clientes.
 */

import { Router } from "express";
import { pool }   from "../db/pool.js";
import { auth }   from "../middleware/auth.js";

export const clientsRouter = Router();

// GET /api/clients
clientsRouter.get("/", auth, async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM clients ORDER BY name"
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// POST /api/clients
clientsRouter.post("/", auth, async (req, res, next) => {
  const { name, contact, email, phone, nif } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO clients (name, contact, email, phone, nif) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [name, contact, email, phone, nif]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

// PUT /api/clients/:id
clientsRouter.put("/:id", auth, async (req, res, next) => {
  const { name, contact, email, phone, nif } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE clients SET name=$1, contact=$2, email=$3, phone=$4, nif=$5 WHERE id=$6 RETURNING *",
      [name, contact, email, phone, nif, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// DELETE /api/clients/:id
clientsRouter.delete("/:id", auth, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM clients WHERE id=$1", [req.params.id]);
    res.status(204).end();
  } catch (e) { next(e); }
});
