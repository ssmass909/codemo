var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
const MONGO_URI = process.env.mongoDbConnectionString || "";
if (!MONGO_URI) {
    throw new Error("🚨 MONGO_URI is not defined in environment variables");
}
// Prevent multiple connections in dev with hot reload
let isConnected = false;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isConnected) {
        console.log("✅ Using existing MongoDB connection");
        return;
    }
    try {
        yield mongoose.connect(MONGO_URI);
        isConnected = true;
        console.log("✅ MongoDB connected");
    }
    catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
});
mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected");
});
mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
});
export default connectDB;
