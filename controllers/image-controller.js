import Image from "../models/image.js";
import { uploadToCloudinary } from "../helpers/cloudinary-helper.js";
import fs from "fs";

export const uploadImage = async (req, res) => {
  try {
    //Check if file exists in request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required.",
      });
    }

    //Upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //Store the image url and public Id along with the userId in database

    const uploadedImage = await Image.create({
      url,
      publicId,
      uploadedBy: req.user.userId,
    });

    //Delete the locally stored image after uploading to cloudinary
    fs.unlinkSync(req.file.path);

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      image: uploadedImage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
};
