import mongoose, { Schema, Document, Types } from 'mongoose';

export interface I_User {
  email: string;
  password: string;
}

export interface I_UserDocument extends Document, I_User {
  _id: Types.ObjectId;
  role: string;
  profileId: Types.ObjectId;
}

export interface I_UserCreate extends I_User {
  role: string;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  tel?: string; // sitter profile
  acceptedPets?: string[]; // sitter profile
  presentation?: string; // sitter profile
  pets?: string[]; // owner profile
}

export interface I_UserUpdate {
  email?: string;
  password?: string;
}

const userSchema = new Schema<I_UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileId: { type: Schema.Types.ObjectId, ref: 'Profile' },
});

export const UserModel = mongoose.model<I_UserDocument>('User', userSchema);
