import express from "express";
import {
  createUser,
  userLogin,
  forgotPassword,
} from "../controllers/authController.js";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", createUser);

router.post("/login", userLogin);

router.post("/forgot-password", forgotPassword);

router.get("/test", requireSignin, isAdmin, (req, res) => {
  res.send("this is protected route");
});

router.get("/user-auth", requireSignin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
