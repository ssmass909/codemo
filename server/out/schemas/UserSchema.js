import { Schema, model } from "mongoose";
const UserSchema = new Schema({
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
}, {
    timestamps: true,
});
export const User = model("User", UserSchema);
