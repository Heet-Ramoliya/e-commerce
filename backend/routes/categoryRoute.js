import express from "express";
import {
  createCategory,
  updateCategory,
  getAllCategory,
  getSingleCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-category", requireSignin, isAdmin, createCategory);

router.put("/update-category/:id", requireSignin, isAdmin, updateCategory);

router.get("/getAll-category", getAllCategory);

router.get("/single-category/:slug", getSingleCategory);

router.delete("/delete-category/:id", requireSignin, isAdmin, deleteCategory);

export default router;
