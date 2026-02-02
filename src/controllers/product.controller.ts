import { Request, Response } from "express";
import Product from "../models/product.model";
import { deleteFile } from "../utils/fileHandler";

export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productData = req.body;

    if (req.file) {
      productData.imageUrl = req.file.path;
    }

    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating Product", error: error.message });
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 }); // sort dari yg terbaru
    res.status(200).json(products);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productData = req.body;

    if (req.file) {
      const oldProduct = await Product.findById(req.params.id);
      if (oldProduct?.imageUrl) {
        await deleteFile(oldProduct.imageUrl);
      }
      productData.imageUrl = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true },
    );

    if (!product) {
      if (req.file) await deleteFile(req.file.path);
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (error: any) {
    if (req.file) await deleteFile(req.file.path);
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (product.imageUrl) {
      await deleteFile(product.imageUrl);
    }

    res.status(200).json({ message: "Product deleted succesfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};
