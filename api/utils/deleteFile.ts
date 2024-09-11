import fs from 'fs';

export const deleteFile = (filePath: string): void => {
  try {
    // not delete default files
    const defaultProfilePicturePath =
      './public/uploads/profilePicture/default-profile-picture.png';
    if (filePath !== defaultProfilePicturePath) {
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
