import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validate } from "../middleware/validate.js";
import { authQuerySchema, loginBodySchema } from "../validators/auth.js";

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

authRouter.post(
  "/login",
  validate({ body: loginBodySchema, query: authQuerySchema }),
  async (req, res, next) => {
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
      return res.json({ token, user: { id: DEMO_USER.id, name: DEMO_USER.name, role: DEMO_USER.role } });
    } catch (e) {
      return next(e);
    }
  }
);
