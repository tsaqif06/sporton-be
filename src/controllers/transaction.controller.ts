import { Request, Response } from "express";
import Transaction from "../models/transaction.model";
import { deleteFile } from "../utils/fileHandler";
import Product from "../models/product.model";

export const createTransaction = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const transactionData = req.body;

    if (
      transactionData.purchasedItems &&
      typeof transactionData.purchasedItems === "string"
    ) {
      transactionData.purchasedItems = JSON.parse(
        transactionData.purchasedItems,
      );
    }

    if (req.file) {
      transactionData.paymentProof = req.file.path;
    }

    const transaction = new Transaction(transactionData);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating Transaction", error: error.message });
  }
};

export const getTransactions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const transactions = await Transaction.find()
      .populate("purchasedItems.productId")
      .sort({ createdAt: -1 }); // sort dari yg terbaru
    res.status(200).json(transactions);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching transactions", error: error.message });
  }
};

export const getTransactionById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate(
      "purchasedItems.productId",
    );

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    res.status(200).json(transaction);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching transaction", error: error.message });
  }
};

export const updateTransaction = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const transactionData = req.body;
    const { id } = req.params;

    if (
      transactionData.purchasedItems &&
      typeof transactionData.purchasedItems === "string"
    ) {
      transactionData.purchasedItems = JSON.parse(
        transactionData.purchasedItems,
      );
    }

    const oldTransaction = await Transaction.findById(id);
    if (!oldTransaction) {
      if (req.file) await deleteFile(req.file.path);
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    if (req.file) {
      if (oldTransaction.paymentProof) {
        await deleteFile(oldTransaction.paymentProof);
      }
      transactionData.paymentProof = req.file.path;
    }

    if (
      oldTransaction.status === "pending" &&
      transactionData.status === "paid"
    ) {
      const updateStockPromises = oldTransaction.purchasedItems.map((item) => {
        return Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.qty },
        });
      });

      await Promise.all(updateStockPromises);
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      transactionData,
      { new: true },
    );

    res.status(200).json(transaction);
  } catch (error: any) {
    if (req.file) await deleteFile(req.file.path);
    res
      .status(500)
      .json({ message: "Error updating transaction", error: error.message });
  }
};

export const deleteTransaction = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    if (transaction.paymentProof) {
      await deleteFile(transaction.paymentProof);
    }

    res.status(200).json({ message: "Transaction deleted succesfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting transaction", error: error.message });
  }
};
