/**
 * routes/certificates.js
 */
import { Router } from "express";
import { pool }   from "../db/pool.js";
import { auth }   from "../middleware/auth.js";

export const certificatesRouter = Router();

const newCertId = async () => {
  const year = new Date().getFullYear();
  const { rows } = await pool.query("SELECT COUNT(*) FROM certificates WHERE date_part('year', issued) = $1", [year]);
  const n = Number(rows[0].count) + 1;
  return `RAEE-${year}-${String(n).padStart(3, "0")}`;
};

// GET /api/certificates
certificatesRouter.get("/", auth, async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM certificates ORDER BY issued DESC");
    res.json(rows);
  } catch (e) { next(e); }
});

// POST /api/certificates  (genera y marca la recogida)
certificatesRouter.post("/", auth, async (req, res, next) => {
  const { collectionId } = req.body;
  try {
    const certId = await newCertId();
    const { rows } = await pool.query(
      "INSERT INTO certificates (id, collection_id, issued) VALUES ($1,$2,CURRENT_DATE) RETURNING *",
      [certId, collectionId]
    );
    await pool.query(
      "UPDATE collections SET certified=true, cert_id=$1 WHERE id=$2",
      [certId, collectionId]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

/* ─────────────────────────────────────────────────────────── */

/**
 * routes/auth.js  (incluido aquí para simplificar)
 */
import jwt      from "jsonwebtoken";
import bcrypt   from "bcryptjs";

export const authRouter = Router();

// En producción, los usuarios estarían en la BD.
const DEMO_USER = {
  id: 1,
  email: "admin@technole.es",
  // bcrypt hash de "admin123"
  passwordHash: "$2a$10$Dty8BQqxhkUa3P2MZYp4i.g9pJFVhJvLw3jq3Bp5Qrq9Gvq7HTMO",
  name: "Admin",
  role: "admin",
};

authRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (email !== DEMO_USER.email) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
    const valid = await bcrypt.compare(password, DEMO_USER.passwordHash);
    if (!valid) return res.status(401).json({ error: "Credenciales incorrectas" });

    const token = jwt.sign(
      { id: DEMO_USER.id, role: DEMO_USER.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ token, user: { id: DEMO_USER.id, name: DEMO_USER.name, role: DEMO_USER.role } });
  } catch (e) { next(e); }
});
