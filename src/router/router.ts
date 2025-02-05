import { Router } from "express";
import { rolesMiddleware } from "../middlewares/roles.middleware";
import { tokenMiddleware } from "../middlewares/token.middleware";
import { register, login, token, me } from "../controllers/user.controller";
import { test } from "../controllers/test.controller";
import { Roles } from "../types/roles";

const router = Router();

// user
router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/token", token);
router.get("/auth/me", tokenMiddleware, me);

// test
router.get("/test", tokenMiddleware, rolesMiddleware([Roles.Admin]), test);

export default router;
