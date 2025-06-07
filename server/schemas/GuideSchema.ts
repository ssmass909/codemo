import mongoose, { Schema, Document, Types } from "mongoose";
import { GuideStep } from "../types.js";

export interface IGuide extends Document {
  owner: Types.ObjectId;
  title: string;
  description: string;
  steps: GuideStep[];
  language: string;
  concepts: string[];
}

const StepSchema = new Schema<GuideStep>(
  {
    code: { type: String, required: true },
    annotations: [{ type: String }],
  },
  { _id: false }
);

const GuideSchema = new Schema<IGuide>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    steps: { type: [StepSchema], default: [] },
    language: { type: String, required: true },
    concepts: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Guide = mongoose.model<IGuide>("Guide", GuideSchema);
