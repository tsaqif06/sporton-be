import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subFolder = "";
    if (req.baseUrl.includes("products")) subFolder = "products";
    else if (req.baseUrl.includes("categories")) subFolder = "categories";
    else if (req.baseUrl.includes("transactions")) subFolder = "transactions";
    else subFolder = "others";

    const finalDir = path.join("uploads", subFolder);

    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    cb(null, finalDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith("image/")) {
    console.log("mimetype", file.mimetype);
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
  // Penjelasan:
  // Satuan dasar ukuran file dalam komputasi adalah Byte.
  // 1 Kilobyte (KB) setara dengan 1024 Byte.
  // 1 Megabyte (MB) setara dengan 1024 Kilobyte.
  // 1 Gigabyte (GB) setara dengan 1024 Megabyte.

  // Jadi, untuk mendapatkan 5 MB dalam Byte, perhitungannya adalah:
  // 5 (jumlah MB) * 1024 (konversi dari MB ke KB) * 1024 (konversi dari KB ke Byte)
  // 5 * 1024 * 1024 = 5.242.880 Byte
});
