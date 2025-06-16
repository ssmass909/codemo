import { Schema, Document, model } from "mongoose";

export interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
  bio?: string;
}

export type IUser = UserType & Document;

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
    },
    location: {
      type: String,
    },
    website: {
      type: String,
    },
    bio: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", UserSchema);
