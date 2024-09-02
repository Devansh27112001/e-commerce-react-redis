import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (err) {
    console.log("Error connecting to MongoDB", err.message);
    process.exit(1);
  }
};
