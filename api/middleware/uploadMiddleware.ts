import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png/;
  const errorMessage =
    'Invalid file type. Only JPG, JPEG, and PNG files are allowed.';
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error(errorMessage));
  }
};

// Multer setup for file uploads
export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `./public/uploads/${file.fieldname}`);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  }),
  fileFilter: fileFilter,
  // limits: { fileSize: 5 * 1024 * 1024 }, // Optional: Set file size limit
});

// Error handling middleware for file upload errors
export const handleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    res.status(400).send({
      status: 400,
      message: err.message,
    });
  } else {
    next();
  }
};
