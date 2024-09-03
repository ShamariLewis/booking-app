import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/Hotel";
import { HotelType } from "../shared/types";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// api/my-hotels
// imageFiles is the name of our form property in our
// front end. It will be a images array in our front-end form.
// It will hold a max of 6 images
// only logged in users should be able to create an hotel entry
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      //1. Upload the images to cloudinary
      const uploadPromises = imageFiles.map(async (image) => {
        // encode image to base 64 string for cloudinary
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        // here we return the url of the image that was uploaded to cloudinary.
        return res.url;
      });

      // Will return an array of all the resolved promises.
      const imageUrls = await Promise.all(uploadPromises);

      // save the imageUrls to our new hotel
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      // Create our hotel entry from all the data passed in and save.
      const hotel = new Hotel(newHotel);
      await hotel.save();

      res.status(201).send(hotel);
    } catch (error) {
      console.log("Error creating hotel", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

export default router;
