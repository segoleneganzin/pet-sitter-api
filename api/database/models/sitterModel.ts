import mongoose, { Schema, Document, Types } from 'mongoose';

export interface I_Sitter {
  profilePicture: String;
  firstName: string;
  lastName: string;
  tel: string;
  city: string;
  country: string;
  presentation: string;
  acceptedPets: ('cat' | 'dog' | 'nac')[];
}

export interface I_SitterDocument extends Document, I_Sitter {
  _id: Types.ObjectId;
}

const sitterSchema = new Schema<I_SitterDocument>({
  profilePicture: { type: String, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  tel: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  presentation: { type: String, required: true },
  acceptedPets: { type: [String], required: true },
});

export const SitterModel = mongoose.model<I_SitterDocument>(
  'Sitter',
  sitterSchema
);
