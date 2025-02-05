import { Request, Response } from "express";
import { logEvents } from "./logEvents.middleware";

export const errorHandler = (err: Error, req: Request, res: Response) => {
  console.error(err.stack);

  // registrar el error en el archivo de log
  logEvents(`ERROR: ${req.method} ${req.url} - ${err.message}`);

  res
    .status(500)
    .json({ message: "Error interno del servidor", error: err.message });
};
