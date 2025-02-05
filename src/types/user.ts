import { JwtPayload } from "jsonwebtoken";
import { Roles } from "./roles";

export interface UserPayload extends JwtPayload {
  id: number;
  role: Roles;
}
