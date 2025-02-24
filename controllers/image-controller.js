import Image from "../models/image.js";
import { uploadToCloudinary } from "../helpers/cloudinary-helper.js";
import fs from "fs/promises";

export const uploadImage = async (req, res) => {
  try {
    //Check if file exists in request
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: "File is required.",
      });
    }

    //Upload to cloudinary
    const uploadedFiles = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.path))
    );

    //Store the image url and public Id along with the userId in database

    const dBuploadedImages = await Promise.all(
      uploadedFiles.map((file) =>
        Image.create({
          url: file.url,
          publicId: file.publicId,
          uploadedBy: req.user.userId,
        })
      )
    );

    //Delete the locally stored image after uploading to cloudinary

    await Promise.all(req.files.map((file) => fs.unlink(file.path)));

    // fs.unlinkSync(req.file.path);

    return res.status(201).json({
      success: true,
      message: "Uploaded successfully",
      data: dBuploadedImages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
};
