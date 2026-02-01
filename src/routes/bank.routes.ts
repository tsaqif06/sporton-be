import { Router } from "express";
import {
  createBank,
  getBanks,
  getBankById,
  updateBank,
  deleteBank,
} from "../controllers/bank.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.post("/", authenticate, createBank);
router.get("/", getBanks);
router.get("/:id", getBankById);
router.put("/:id", authenticate, updateBank);
router.delete("/:id", authenticate, deleteBank);

export default router;
