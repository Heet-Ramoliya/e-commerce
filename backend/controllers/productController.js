import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";

//CREATE PRODUCT || POST
const createProduct = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // Validation
    if (!name) return res.status(400).send({ message: "Name is required" });
    if (!description)
      return res.status(400).send({ message: "Description is required" });
    if (!price) return res.status(400).send({ message: "Price is required" });
    if (!category)
      return res.status(400).send({ message: "Category is required" });
    if (!quantity)
      return res.status(400).send({ message: "Quantity is required" });
    if (photo && photo.size > 1000000) {
      return res.status(400).send({ message: "Photo should be less than 1MB" });
    }

    // Create product
    const products = new productModel({
      ...req.fields,
      slug: slugify(name),
    });

    // Handle photo
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error: error.message,
    });
  }
};

//GET ALL PRODUCTS || GET
const getProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      total: products.length,
      message: "Successfully get all products",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in get all Products",
      error: error.message,
    });
  }
};

//GET SINGLE PRODUCT || GET
const getSingleProduct = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category")
      .select("-photo");
    res.status(200).send({
      success: true,
      message: "Successfully getting single product",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting single product",
      error,
    });
  }
};

//GET PRODUCT PHOTO || GET
const getProductPhoto = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting product image",
      error,
    });
  }
};

//DELETE PRODUCT || DELETE
const deleteProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in delete product",
      error,
    });
  }
};

// UPDATE PRODUCT || PUT
const updateProduct = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields || {};
    const { photo } = req.files || {};

    // Validation
    if (name && !name.trim())
      return res.status(400).send({ message: "Name is required" });
    if (description && !description.trim())
      return res.status(400).send({ message: "Description is required" });
    if (price && isNaN(price))
      return res.status(400).send({ message: "Price should be a number" });
    if (category && !category.trim())
      return res.status(400).send({ message: "Category is required" });
    if (quantity && isNaN(quantity))
      return res.status(400).send({ message: "Quantity should be a number" });
    if (photo && photo.size > 1000000)
      return res.status(400).send({ message: "Photo should be less than 1MB" });

    // Find and update product
    const product = await productModel.findById(req.params.pid);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Update fields if they are provided
    if (name) product.name = name;
    if (slug) product.slug = slugify(name);
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (quantity) product.quantity = quantity;
    if (shipping !== undefined) product.shipping = shipping;

    // Handle photo if provided
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
      error: error.message,
    });
  }
};

//FILTER PRODUCT || POST
const getProductFilter = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Filtering Products",
      error,
    });
  }
};

//PRODUCT COUNT || GET
const getProductCount = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in product count",
      error,
    });
  }
};

//PRODUCT LIST BASE ON PAGE || POST
const productList = async (req, res) => {
  try {
    const perPage = 8;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page controller",
      error,
    });
  }
};

//SEARCH PRODUCT || GET
const searchProduct = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

export {
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
};
