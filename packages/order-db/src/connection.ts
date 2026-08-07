import mongoose from "mongoose";

let isConnected = false;

export const connectOrderDB = async () => {
  if (isConnected) return;
  if (!process.env.MONGO_URL) {
    throw Error("MONGO URL is not defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
