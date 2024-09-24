import mongoose, { Schema, Document, Types } from 'mongoose';

export interface I_Sitter {
  profilePicture: string;
  firstName: string;
  lastName: string;
  tel: string;
  city: string;
  country: string;
  presentation: string;
  acceptedPets: ('cat' | 'dog' | 'nac')[];
  userId: Types.ObjectId;
}

export interface I_SitterDocument extends Document, I_Sitter {
  id: Types.ObjectId;
}

const sitterSchema = new Schema<I_SitterDocument>({
  profilePicture: { type: String, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  tel: { type: String, required: false },
  city: { type: String, required: true },
  country: { type: String, required: true },
  presentation: { type: String, required: true },
  acceptedPets: { type: [String], required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
});

sitterSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v; // Optionally remove __v field if it's not needed
  },
});

export const SitterModel = mongoose.model<I_SitterDocument>(
  'Sitter',
  sitterSchema
);
