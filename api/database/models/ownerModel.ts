import mongoose, { Schema, Document, Types } from 'mongoose';

export interface I_Owner {
  profilePicture: string;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  pets: string[];
  userId: Types.ObjectId;
}

export interface I_OwnerDocument extends Document, I_Owner {
  id: Types.ObjectId;
}

const ownerSchema = new Schema<I_OwnerDocument>({
  profilePicture: { type: String, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  pets: { type: [String], required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
});

ownerSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export const OwnerModel = mongoose.model<I_OwnerDocument>('Owner', ownerSchema);
