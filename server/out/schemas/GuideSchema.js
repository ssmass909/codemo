import mongoose, { Schema } from "mongoose";
const StepSchema = new Schema({
    code: { type: String, required: true },
    annotations: [{ type: String }],
}, { _id: false });
const GuideSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    steps: { type: [StepSchema], default: [] },
    language: { type: String, required: true },
    concepts: { type: [String], default: [] },
}, { timestamps: true });
export const Guide = mongoose.model("Guide", GuideSchema);
