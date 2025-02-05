import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../types/user";

export const tokenMiddleware = (
  req: Request & { user?: UserPayload },
  res: Response,
  next: NextFunction
) => {
  try {
    // validar si existe el token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }
    // extraer el token
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }

    // obtener la información del usuario
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as UserPayload;

    // pasar la información del usuario al request
    req.user = payload;
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};
