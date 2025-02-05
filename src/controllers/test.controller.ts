import { Request, Response } from "express";
import { UserPayload } from "../types/user";

export const test = async (
  req: Request & { user?: UserPayload },
  res: Response
) => {
  console.log("test");

  try {
    const user = req.user;
    console.log(user);

    if(!user) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }

    res.status(200).json({ message: "Test" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno en el servidor" });
  }
};
