import fs from "fs";

export const deleteFile = (filePath: string | undefined | null): void => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Berhasil hapus file: ${filePath}`);
    } catch (err) {
      console.error(`Gagal hapus file: ${err}`);
    }
  }
};
