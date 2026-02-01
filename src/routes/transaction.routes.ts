import { Router } from "express";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.post("/", authenticate, upload.single("image"), createTransaction);
router.get("/", authenticate, getTransactions);
router.post("/checkout", upload.single("image"), createTransaction);
router.get("/:id", getTransactionById);
router.put("/:id", authenticate, upload.single("image"), updateTransaction);
router.delete("/:id", authenticate, deleteTransaction);

export default router;
