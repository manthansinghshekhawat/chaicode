import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db.js";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user_routes.js";
dotenv.config();
db();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["GET,POST,PUT,DELETE"],
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use("/api/v1/users", userRoutes);







const PORT = process.env.PORT || 3000;
app.get("/", (_req, res) => {
  res.send("Hello World how are you hey there");
});
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
