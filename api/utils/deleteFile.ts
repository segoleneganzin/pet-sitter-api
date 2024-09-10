import fs from 'fs';

export const deleteFile = (filePath: string): void => {
  try {
    // not delete default files
    const defaultAvatarPath = './public/uploads/avatar//default-avatar.png';
    const defaultThumbnailPath =
      './public/uploads/projectImg//default-thumbnail.png';
    if (filePath !== defaultAvatarPath && filePath !== defaultThumbnailPath) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.log(`File not found: ${filePath}`);
      }
    }
  } catch (err) {
    console.error(`Error deleting file: ${filePath}`, err);
  }
};
