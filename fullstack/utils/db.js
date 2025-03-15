import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const db = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("DB connected");
    })
    .catch((err) => {
      console.log(err);
    });
};
// console.error("Manthan");
export default db;

