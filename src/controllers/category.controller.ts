import { Request, Response } from "express";
import Category from "../models/category.model";
import { deleteFile } from "../utils/fileHandler";

export const createCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categoryData = req.body;

    if (req.file) {
      categoryData.imageUrl = req.file.path;
    }

    const category = new Category(categoryData);
    await category.save();
    res.status(201).json(category);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating Category", error: error.message });
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }); // sort dari yg terbaru
    res.status(200).json(categories);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json(category);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching category", error: error.message });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categoryData = req.body;

    if (req.file) {
      const oldCategory = await Category.findById(req.params.id);
      if (oldCategory?.imageUrl) {
        deleteFile(oldCategory.imageUrl);
      }
      categoryData.imageUrl = req.file.path;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      categoryData,
      { new: true },
    );

    if (!category) {
      if (req.file) deleteFile(req.file.path);
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json(category);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    deleteFile(category.imageUrl);

    res.status(200).json({ message: "Category deleted succesfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};
