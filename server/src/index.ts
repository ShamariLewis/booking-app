import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/usersRoutes";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import path from "path";

// This setup is required when working with typescript
mongoose.connect(process.env.MONGO_URI as string);

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// origin: FRONTEND_URL tells our server to only accept request from this server or origin
// and that URL must include credentials from our cookie.
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "../../client/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const port = process.env.PORT || 5100;

app.listen(port, () => {
  console.log("App is up and running");
});
