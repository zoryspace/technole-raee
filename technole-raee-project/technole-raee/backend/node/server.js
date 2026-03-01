/**
 * server.js — Servidor Express principal
 * ─────────────────────────────────────────────────────────
 * Arranca el servidor HTTP y registra las rutas de la API.
 * La conexión a la BD se configura en db/pool.js.
 * ─────────────────────────────────────────────────────────
 */

import "dotenv/config";
import express from "express";
import cors from "cors";

import { clientsRouter } from "./routes/clients.js";
import { collectionsRouter } from "./routes/collections.js";
import { certificatesRouter } from "./routes/certificates.js";
import { authRouter } from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ─────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// ── Rutas ──────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/collections", collectionsRouter);
app.use("/api/certificates", certificatesRouter);

// ── Health check ───────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok", ts: new Date().toISOString() }));

// ── Error handler ──────────────────────────────────────────
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const code = err.code || (status === 400 ? "BAD_REQUEST" : "INTERNAL_ERROR");

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    error: {
      code,
      message: err.message || "Internal server error",
      details: err.details || [],
    },
  });
});

app.listen(PORT, () => console.log(`✓ API en http://localhost:${PORT}`));
