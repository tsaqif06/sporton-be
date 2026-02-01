import mongoose, { Schema, Document } from "mongoose";

interface IPurchasedItem {
  productId: mongoose.Types.ObjectId;
  qty: number;
}

export interface ITransaction extends Document {
  paymentProof: string;
  status: "pending" | "paid" | "rejected";
  purchasedItems: IPurchasedItem[];
  totalPayment: number;
  customerName: string;
  customerContact: number | null;
  customerAddress: string;
}

const TransactionSchema: Schema = new Schema(
  {
    paymentProof: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "rejected"],
      default: "pending",
    },
    purchasedItems: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: { type: Number, required: true },
      },
    ],
    totalPayment: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerContact: { type: Number, required: false, default: null },
    customerAddress: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
