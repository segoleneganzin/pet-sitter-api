import mongoose, { Schema, Document, Types } from 'mongoose';

export interface I_User {
  email: string;
  password: string;
}

export interface I_UserDocument extends Document, I_User {
  id: Types.ObjectId;
  email: string;
  role: 'sitter' | 'owner';
  profileId: Types.ObjectId;
}

export interface I_UserCreate extends I_User {
  email: string;
  password: string;
  role: 'sitter' | 'owner';
  profilePicture: string;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  tel?: string; // sitter profile
  acceptedPets?: string | string[]; // sitter profile
  presentation?: string; // sitter profile
  pets?: string | string[]; // owner profile
}

export interface I_UserUpdate {
  email?: string;
  password?: string;
}

const userSchema = new Schema<I_UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  profileId: { type: Schema.Types.ObjectId, ref: 'Profile' },
});

// Hide password when converting to JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password; // Remove the password field
    delete ret.__v; // Optionally remove __v field if it's not needed
  },
});

export const UserModel = mongoose.model<I_UserDocument>('User', userSchema);
