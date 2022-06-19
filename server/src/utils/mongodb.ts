import mongoose from "mongoose";
import config from "config";

export async function connectToMongoDb() {
  try {
    await mongoose.connect(process.env.DB_URI as string);
    console.log("Connected to the Database :D");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
