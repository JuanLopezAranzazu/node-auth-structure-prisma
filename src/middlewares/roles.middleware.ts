import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../types/user";

export const rolesMiddleware = (requiredRoles: string[]) => {
  return (
    req: Request & { user?: UserPayload },
    res: Response,
    next: NextFunction
  ) => {
    const userRole = req.user?.role || "";
    console.log(req.user);

    // verificar si el usuario tiene al menos uno de los roles requeridos
    const hasRole = requiredRoles.some((role) => role === userRole);

    if (!hasRole) {
      res.status(403).json({ message: "Acceso denegado" });
      return;
    }

    next();
  };
};
