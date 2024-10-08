import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/usersRoutes";
import authRoutes from "./routes/authRoutes";
import myHotelRoutes from "./routes/my-hotels";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
app.use("/api/my-hotels", myHotelRoutes);

// Routes all non-api requests to our index.html in our frontend.
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

const port = process.env.PORT || 5100;

app.listen(port, () => {
  console.log("App is up and running");
});
