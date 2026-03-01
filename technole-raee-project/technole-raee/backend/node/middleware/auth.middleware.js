import jwt from "jsonwebtoken";

export const auth = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next({ status: 401, message: "Token no proporcionado" });
  }

  const token = authHeader.slice("Bearer ".length).trim();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return next({ status: 401, message: "Token inválido o expirado" });
  }
};
