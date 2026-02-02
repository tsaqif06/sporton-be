import { v2 as cloudinary } from "cloudinary";

export const deleteFile = async (
  imageUrl: string | undefined | null,
): Promise<void> => {
  if (!imageUrl) return;

  try {
    const parts = imageUrl.split("/");
    const fileNameWithExtension = parts.pop() || "";
    const folder = parts.pop() || "";
    const publicId = `${folder}/${fileNameWithExtension.split(".")[0]}`;

    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Berhasil hapus file: ${result.result} untuk ID: ${publicId}`);
  } catch (err) {
    console.error(`Gagal hapus file: ${err}`);
  }
};
