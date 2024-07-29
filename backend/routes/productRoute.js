import express from "express";
import {
  createProduct,
  getProducts,
  getSingleProduct,
  getProductPhoto,
  deleteProduct,
  updateProduct,
  getProductFilter,
  getProductCount,
  productList,
  searchProduct,
} from "../controllers/productController.js";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

router.post(
  "/create-product",
  requireSignin,
  isAdmin,
  formidable(),
  createProduct
);

router.put(
  "/update-product/:pid",
  requireSignin,
  isAdmin,
  formidable(),
  updateProduct
);

router.get("/get-product", getProducts);

router.get("/get-product/:slug", getSingleProduct);

router.get("/product-photo/:pid", getProductPhoto);

router.delete("/delete-product/:pid", deleteProduct);

router.post("/product-filter", getProductFilter);

router.get("/product-count", getProductCount);

router.get("/product-list/:page", productList);

router.get("/search/:keyword", searchProduct);

export default router;
