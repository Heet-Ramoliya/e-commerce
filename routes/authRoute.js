import express from "express";
import { createUser, userLogin } from "../controllers/authController.js";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", createUser);

router.post("/login", userLogin);

router.get("/test", requireSignin, isAdmin, (req, res) => {
  res.send("this is protected route");
});

export default router;
