import mongoose, { Schema, Document, Types } from 'mongoose';

type roles = 'sitter' | 'owner';
export interface I_User {
  email: string;
  password: string;
}

export interface I_UserDocument extends Document, I_User {
  id: Types.ObjectId;
  email: string;
  roles: roles[];
}

export interface I_UserCreate extends I_User {
  email: string;
  password: string;
  roles: roles;
  profilePicture: string;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  tel?: string; // sitter profile
  acceptedPets?: string | string[]; // sitter profile
  presentation?: string; // sitter profile
  pets?: string | string[]; // owner profile
  userId: Types.ObjectId;
}

export interface I_UserUpdate {
  email?: string;
  password?: string;
}

const userSchema = new Schema<I_UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: [String], required: true },
  // profileId: { type: Schema.Types.ObjectId, ref: 'Profile' },
});

// Hide password when converting to JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password; // Remove the password field
    delete ret.__v;
  },
});

export const UserModel = mongoose.model<I_UserDocument>('User', userSchema);
