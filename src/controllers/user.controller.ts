import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserPayload } from "../types/user";
import { hashPassword, comparePassword } from "../utils/password";
import { Roles } from "../types/roles";
import prisma from "../config/db";

export const register = async (req: Request, res: Response) => {
  console.log("register");

  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    // verificar si el correo ya está registrado
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      res.status(400).json({ message: "El correo ya está registrado" });
      return;
    }
    // crear usuario
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: await hashPassword(password),
        role: Roles.User,
      },
    });

    res
      .status(201)
      .json({ message: "Usuario registrado", currentUser: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno en el servidor" });
  }
};

export const login = async (req: Request, res: Response) => {
  console.log("login");

  try {
    const { email, password } = req.body;
    console.log(email, password);

    // buscar usuario por correo
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Credenciales incorrectas" });
      return;
    }

    // validar contraseña
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Credenciales incorrectas" });
      return;
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    // generar token de acceso
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    // generar token de actualización
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_REFRESH as string,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ currentUser: user, accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno en el servidor" });
  }
};

export const token = async (req: Request, res: Response) => {
  console.log("token");

  try {
    const { refreshToken } = req.body;
    console.log(refreshToken);

    // validar si el token de actualización fue proporcionado
    if (!refreshToken) {
      res
        .status(400)
        .json({ message: "Token de actualización no proporcionado" });
      return;
    }

    // verificar si el token de actualización es válido
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH as string
    ) as JwtPayload;

    const { id, email, roles } = payload;

    // generar nuevo token de acceso
    const accessToken = jwt.sign(
      { id, email, roles },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno en el servidor" });
  }
};

export const me = async (
  req: Request & { user?: UserPayload },
  res: Response
) => {
  console.log("me");

  try {
    // recuperar usuario autenticado
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }

    const currentUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!currentUser) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json({ currentUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno en el servidor" });
  }
};
