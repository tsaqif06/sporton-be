import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: Express.Multer.File) => {
    let subFolder = "others";
    if (req.baseUrl.includes("products")) subFolder = "products";
    else if (req.baseUrl.includes("categories")) subFolder = "categories";
    else if (req.baseUrl.includes("transactions")) subFolder = "transactions";

    return {
      folder: `sporton-be/${subFolder}`,
      allowed_formats: ['jpg', 'png', 'jpeg'],
      public_id: Date.now() + "-" + Math.round(Math.random() * 1e9),
    };
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 4 * 1024 * 1024 },
});