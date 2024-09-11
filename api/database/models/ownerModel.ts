import mongoose, { Schema, Document, Types } from 'mongoose';

export interface I_Owner {
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  pets: string[];
}

export interface I_OwnerDocument extends Document, I_Owner {
  _id: Types.ObjectId;
}

const ownerSchema = new Schema<I_OwnerDocument>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  pets: { type: [String], required: true },
});

export const OwnerModel = mongoose.model<I_OwnerDocument>('Owner', ownerSchema);
