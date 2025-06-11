import mongoose from "mongoose";

const MONGO_URI = process.env.mongoDbConnectionString || "";

if (!MONGO_URI) {
  throw new Error("🚨 MONGO_URI is not defined in environment variables");
}

// Prevent multiple connections in dev with hot reload
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

export default connectDB;
