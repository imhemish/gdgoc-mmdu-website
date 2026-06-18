import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });
    connection.on("error", (err) => {
      console.log("MongoDB connection error", err);
      process.exit(1);
    });
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

export default dbConnect;
