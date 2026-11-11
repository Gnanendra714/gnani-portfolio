import mongoose from "mongoose";

let isConnected = false;

export async function connectDB(): Promise<typeof mongoose> {
  // Read environment variables when the function executes.
  const MONGODB_URI = process.env.MONGODB_URI;
  const DB_NAME = process.env.DB_NAME || "test";

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Please configure backend/.env");
  }

  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;

    console.log(
      `✅ [MongoDB Atlas] Connected successfully to database: ${mongoose.connection.name}`,
    );

    mongoose.connection.on("error", (err) => {
      console.error("❌ [MongoDB] Runtime connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ [MongoDB] Disconnected from MongoDB Atlas.");
      isConnected = false;
    });

    return mongoose;
  } catch (error) {
    isConnected = false;

    console.error("❌ [MongoDB Atlas] Initial connection failed:", error);

    throw error;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    console.log("🔌 [MongoDB] Connection closed.");
  }
}
