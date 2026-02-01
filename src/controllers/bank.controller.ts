import { Request, Response } from "express";
import Bank from "../models/bank.model";

export const createBank = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const bankData = req.body;
    const bank = new Bank(bankData);
    await bank.save();
    res.status(201).json(bank);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating Bank", error: error.message });
  }
};

export const getBanks = async (req: Request, res: Response): Promise<void> => {
  try {
    const banks = await Bank.find().sort({ createdAt: -1 }); // sort dari yg terbaru
    res.status(200).json(banks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching banks", error: error.message });
  }
};

export const getBankById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const bank = await Bank.findById(req.params.id);

    if (!bank) {
      res.status(404).json({ message: "Bank not found" });
      return;
    }

    res.status(200).json(bank);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching bank", error: error.message });
  }
};

export const updateBank = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const bankData = req.body;

    const bank = await Bank.findByIdAndUpdate(req.params.id, bankData, {
      new: true,
    });

    if (!bank) {
      res.status(404).json({ message: "Bank not found" });
      return;
    }

    res.status(200).json(bank);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating bank", error: error.message });
  }
};

export const deleteBank = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const bank = await Bank.findByIdAndDelete(req.params.id);

    if (!bank) {
      res.status(404).json({ message: "Bank not found" });
      return;
    }

    res.status(200).json({ message: "Bank deleted succesfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting bank", error: error.message });
  }
};
