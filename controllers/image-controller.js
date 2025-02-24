import Image from "../models/image.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../helpers/cloudinary-helper.js";
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

export const deleteImgs = async (req, res) => {
  try {
    // Check if the user is authenticated and the image IDs are provided
    const { userId } = req.user;
    const { publicIds } = req.body; // Expect an array of ids

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to perform this action",
      });
    }
    if (!publicIds || publicIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide the public IDs of the images",
      });
    }

    // Delete the images from the database
    const deleteFromDB = publicIds.map((publicId) =>
      Image.findOneAndDelete({ publicId, uploadedBy: userId }).select(
        "publicId"
      )
    );

    const dbResponse = await Promise.all(deleteFromDB);

    // Extract valid deletions
    const validDeletions = dbResponse
      .filter((item) => item !== null) // Ensure only found images
      .map((item) => item.publicId); // Extract publicId

    if (validDeletions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No images found with the provided IDs",
      });
    }

    // Delete from Cloudinary
    const result = await deleteFromCloudinary(validDeletions);

    return res.status(200).json({
      success: true,
      message: "Deleted images successfully",
      cloudinaryResponse: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
