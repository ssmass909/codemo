import mongoose, { Schema, Document, Types } from "mongoose";

export interface AnnotationType {
  orderNumber: number;
  text: string;
}

// I am using MongoDB, so GuideStep documents will be nested inside Guide Document, no uuid needed.
export interface GuideStepType {
  code: string;
  annotations: string[];
}

export interface GuideType {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  title: string;
  description: string;
  steps: GuideStepType[];
  language: string;
  concepts: string[];
}

export type IGuide = GuideType & Document;

const StepSchema = new Schema<GuideStepType>(
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
