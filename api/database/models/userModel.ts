import mongoose, { Schema, Document, Types } from 'mongoose';

type Roles = 'sitter' | 'owner';
type Pets = 'cat' | 'dog' | 'nac';

export interface I_Auth {
  email: string;
  password: string;
}
export interface I_User extends I_Auth {
  roles: Roles[];
  profilePicture?: string;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  roleDetails: {
    sitter?: {
      tel?: string;
      presentation?: string;
      acceptedPets?: Pets[];
    };
    owner?: {
      pets?: Pets[];
    };
  };
}

export interface I_UserDocument extends Document, I_User {
  id: Types.ObjectId;
}

export interface I_UserCreate {
  email: string;
  password: string;
  roles: string;
  profilePicture?: string;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  tel?: string;
  presentation?: string;
  acceptedPets?: string;
  pets?: string;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: [String], enum: ['sitter', 'owner'], required: true },
  profilePicture: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  roleDetails: {
    sitter: {
      tel: { type: String },
      presentation: { type: String },
      acceptedPets: { type: [String], enum: ['cat', 'dog', 'nac'] },
    },
    owner: {
      pets: { type: [String] },
    },
  },
});

// Hide password when converting to JSON
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password; // Remove the password field
    delete ret.__v;
  },
});

export const UserModel = mongoose.model<I_UserDocument>('User', UserSchema);
