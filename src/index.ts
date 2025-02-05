import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./router/router";
import { Roles } from "./types/roles";
import prisma from "./config/db";
import { hashPassword } from "./utils/password";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api/v1", router);

// crear un usuario por defecto
const createDefaultUser = async () => {
  try {
    if (
      !process.env.DEFAULT_USER_NAME ||
      !process.env.DEFAULT_USER_EMAIL ||
      !process.env.DEFAULT_USER_PASSWORD
    ) {
      throw new Error("No se ha configurado el usuario por defecto");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: process.env.DEFAULT_USER_EMAIL },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: process.env.DEFAULT_USER_NAME,
          email: process.env.DEFAULT_USER_EMAIL,
          password: await hashPassword(process.env.DEFAULT_USER_PASSWORD),
          role: Roles.Admin
        },
      });
      console.log("Usuario por defecto creado");
    } else {
      console.log("El usuario por defecto ya existe");
    }
  } catch (error) {
    console.error("Error al crear usuario:", error);
  }
};

// iniciar el servidor
const startServer = async () => {
  try {
    await prisma.$connect(); // conexion a la base de datos
    console.log("Base de datos conectada");
    await createDefaultUser(); // crear usuario por defecto
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
};

startServer();
