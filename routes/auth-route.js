import { Router } from "express";
import {
  login,
  logout,
  passwordResetLinkGenerator,
  register,
  resetPassword,
} from "../controllers/auth-controller.js";

const router = Router();

router
  .post("/register", register)
  .post("/login", login)
  .post("/logout", logout)
  .post("/reset-password-link", passwordResetLinkGenerator)
  .post("/reset-password", resetPassword);

export default router;
